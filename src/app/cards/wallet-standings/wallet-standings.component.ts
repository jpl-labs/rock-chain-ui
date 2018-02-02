import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Balance } from '../../../models/Balance';
import { Observable } from 'rxjs/Observable';
import { MatProgressSpinnerModule } from '@angular/material';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-wallet-standings',
  templateUrl: './wallet-standings.component.html',
  styleUrls: ['./wallet-standings.component.css']
})
export class WalletStandingsComponent implements OnInit, OnChanges {
  @Input() accounts: Array<Balance>;
  top20: Array<Balance>;
  top20Total: number;

  constructor(private blockchainService: BlockchainService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.top20 = this.accounts ? this.accounts.splice(0, 20) : [];

    this.top20Total = this.top20.map(account => account.balance).reduce((a, b) => a + b, 0);
  }

  isMyWallet = (wallet: string): boolean => {
    return wallet === localStorage.getItem('walletId');
  }
}
