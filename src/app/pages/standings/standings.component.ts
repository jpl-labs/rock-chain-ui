import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WagerService } from '../../services/wager.service';
import { Charity } from '../../../models/Charity';
import { Balance } from '../../../models/Balance';
import { Observable } from 'rxjs/Observable';
import { BlockchainService } from '../../services/blockchain.service';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  private charities: Observable<Charity> = Observable.from([
    {
      id: 0,
      name: 'Humane Society',
      amount: 0,
      backers: 0,
      icon: 'pets'
    },
    {
      id: 1,
      name: 'Make-A-Wish',
      amount: 0,
      backers: 0,
      icon: 'star_border'
    },
    {
      id: 2,
      name: 'Electronic Frontier Foundation',
      amount: 0,
      backers: 0,
      icon: 'computer'
    }
  ]);

  charities$: Observable<Charity[]>;
  accounts$: Observable<Balance[]>;

  constructor(private wagerService: WagerService,
    public blockchainService: BlockchainService,
    public registerService: RegisterService) {

  }

  ngOnInit() {

    this.accounts$ = this.wagerService.currentRound$.mergeMap(round =>

      this.blockchainService.getAccounts()
        .flatMap(account => account)
        .filter(account => account !== this.blockchainService.genesisAccount)
        .mergeMap((account) =>
          this.blockchainService.getAccountBalance(account)
            .map(balance => {
              return {
                account: account,
                balance: balance,
                winProb: 0
              };
            })
        )
        .filter(wallet => wallet.balance > 0)
        .toArray()
        .map(wallets =>
          wallets
            .sort((a, b) => b.balance - a.balance))

    );

    this.charities$ = this.wagerService.currentRound$.mergeMap(round =>

      this.charities.mergeMap(charity => {

        const accounts = this.registerService.getAccountsForCharity(charity.id)
          .flatMap(account => account)
          .filter(account => account !== this.blockchainService.genesisAccount);

        const sumObservable = accounts.mergeMap(account => this.blockchainService.getAccountBalance(account))
          .filter(balance => balance > 0)
          .reduce((acc, one) => acc + one);

        const countObservable = accounts.count();

        return Observable.zip(sumObservable, countObservable, (sum, count) => {
          charity.amount = sum;
          charity.backers = count;
          return charity;
        });
      }).toArray().map((sortCharities) => {
        sortCharities.sort((a, b) => {
          return b.amount - a.amount;
        });
        return sortCharities;
      })

    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
