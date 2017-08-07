import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { WagerService } from '../../services/wager.service';
import { Charity } from '../../../models/Charity';
import { Balance } from '../../../models/Balance';
import { Observable } from 'rxjs/Observable';
import { BlockchainService } from '../../services/blockchain.service';
import { RegisterService } from '../../services/register.service';
import { CharityService } from '../../services/charity.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  private charities: Observable<Charity> = Observable.from(this.charityService.charities);

  charities$: Observable<Charity[]>;
  accounts$: Observable<Balance[]>;

  constructor(private wagerService: WagerService,
    public blockchainService: BlockchainService,
    public registerService: RegisterService,
    public charityService: CharityService) {

  }

  ngOnInit() {
    /*
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
                  };
                })
            )
            .filter(wallet => wallet.balance > 0)
            .toArray()
            .map(wallets =>
              wallets
                .sort((a, b) => b.balance - a.balance))

        );*/

    this.charities$ = this.wagerService.currentRound$.mergeMap(round =>

      this.charities.mergeMap(charity => {

        const accounts = this.registerService.getAccountsForCharity(charity.id)
          .flatMap(account => account)
          .filter(account => account !== this.blockchainService.genesisAccount);

        const backerObservable = accounts.mergeMap(account => this.blockchainService.getAccountBalance(account)
          .map(balance => {
            return {
              account: account,
              balance: balance,
            };
          }))
          .filter(wallet => wallet.balance !== 1000);

        const sumObservable = backerObservable.map(backer => backer.balance)
          .reduce((acc, one) => acc + one);

        const countObservable = backerObservable.count();

        return Observable.zip(sumObservable, countObservable, backerObservable.toArray(), (sum, count, backerAccounts) => {
          charity.amount = sum;
          charity.backers = count;
          charity.backerAccounts = backerAccounts;
          return charity;
        });
      }).toArray().map((sortCharities) => {
        sortCharities.sort((a, b) => {
          return b.amount - a.amount;
        });
        return sortCharities;
      })

    );

    this.accounts$ = this.charities$.map(x =>
      x.map(c => c.backerAccounts)
        .reduce((a, b) => a.concat(b))
        .sort((a, b) => b.balance - a.balance)
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
