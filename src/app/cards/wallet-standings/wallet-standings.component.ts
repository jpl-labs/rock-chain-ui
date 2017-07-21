import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Balance } from '../../../models/Balance';

@Component({
  selector: 'app-wallet-standings',
  templateUrl: './wallet-standings.component.html',
  styleUrls: ['./wallet-standings.component.css']
})
export class WalletStandingsComponent implements OnInit {
  blockchainService: BlockchainService;
  balances: Array<Balance>;
  topBalance: number;

  constructor(private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.balances = new Array<Balance>();
  }

  ngOnInit() {
    this.blockchainService.getAccounts().map(account => {
      const balance = this.blockchainService.getAccountBalance(account);
      if (balance > 0) {
        this.balances.push({
          account: account,
          balance: balance
        });
      }
    });
    this.balances.sort((a, b) => {
      return (a.balance < b.balance) ? 1 : ((b.balance < a.balance) ? -1 : 0);
    });
    this.balances = this.balances.splice(0, 10);
    this.topBalance = this.balances[0].balance;
  }

  getBalancePercentage = (balance: number) => {
    return Math.floor((1000 / this.topBalance) * 10000000000);
  }
}
