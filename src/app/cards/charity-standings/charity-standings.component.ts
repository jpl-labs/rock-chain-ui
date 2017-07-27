import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/count';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { Charity } from '../../../models/Charity';
import { RegisterService } from '../../services/register.service';
import { Balance } from '../../../models/Balance';

@Component({
  selector: 'app-charity-standings',
  templateUrl: './charity-standings.component.html',
  styleUrls: ['./charity-standings.component.css']
})

export class CharityStandingsComponent implements OnInit {
  blockchainService: BlockchainService;
  registerService: RegisterService;
  charities: Observable<Charity[]>;
  totalCharityAmount: number;

  constructor(private _blockchainService: BlockchainService,
    private _registerService: RegisterService) {
    this.blockchainService = _blockchainService;
    this.registerService = _registerService;
  }

  ngOnInit() {
    this.charities = Observable.of(
      {
        id: 0,
        name: 'Humane Society',
        amount: 0,
        backers: 0,
        icon: 'pets'
      } as Charity,
      {
        id: 1,
        name: 'Make-A-Wish',
        amount: 0,
        backers: 0,
        icon: 'child_care'
      } as Charity,
      {
        id: 2,
        name: 'Electronic Frontier Foundation',
        amount: 0,
        backers: 0,
        icon: 'computer'
      } as Charity).mergeMap(charity => {

        const accounts = this.registerService.getAccountsForCharity(charity.id)
          .flatMap(account => account)
          .filter(account => account !== this.blockchainService.getGenesisAccount());

        const sumObservable = accounts.mergeMap(account => this.blockchainService.getAccountBalance(account))
          .filter(balance => balance > 0)
          .reduce((acc, one) => acc + one);

        const countObservable = accounts.count();

        return Observable.zip(sumObservable, countObservable, (sum, count) => {
          charity.amount = sum;
          charity.backers = count;
          return charity;
        });
      }).toArray();

    this.charities
      .flatMap(charity => charity)
      .reduce(function (sum, value) {
        return sum + value.amount;
      }, 0).subscribe(total =>
        this.totalCharityAmount = total);
  }
}
