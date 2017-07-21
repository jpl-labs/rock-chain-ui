import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-wallet-standings',
  templateUrl: './wallet-standings.component.html',
  styleUrls: ['./wallet-standings.component.css']
})
export class WalletStandingsComponent implements OnInit {
  blockchainService: BlockchainService;
  balances: Map<string, number>;

  constructor(private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.balances = new Map<string, number>();
  }

  ngOnInit() {
    this.blockchainService.getAccounts().map(account => {
      this.balances.set(account, this.blockchainService.getAccountBalance(account));
    });
  }
}
