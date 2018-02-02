import { Component, OnInit } from '@angular/core';
import { WagerService } from '../../services/wager.service';
import { Bet, PlacedBet, MyBet, BetByRound } from '../../../models/Bet';
import {
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatLineModule,
  MatCardModule,
  MatProgressBarModule,
  MatSnackBar
} from '@angular/material';
import { BlockchainService } from '../../services/blockchain.service';
import { Wallet } from '../../../models/Wallet';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.css']
})
export class BetsComponent implements OnInit {


  myBets: Array<MyBet>;
  wallet: Wallet;

  constructor(public wagerService: WagerService, public blockchainService: BlockchainService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    const tmpWallet = localStorage.getItem('walletId');
    if (tmpWallet) {
      this.blockchainService.getAccountBalance(tmpWallet).subscribe(balance => {
        this.wallet = {
          id: tmpWallet,
          balance: balance
        };
      });
    }
  }

  placeBetByRound = (betByRound: BetByRound) => {
    this.wagerService.placeBetMultiRounds(
      {
        artist: betByRound.artist,
        walletId: this.wallet.id,
        password: betByRound.password,
        numberOfRounds: betByRound.numberOfRounds
      });
    const rounds = (betByRound.numberOfRounds > 1) ? betByRound.numberOfRounds + ' rounds' : 'round';
    this.snackBar.open('Bet placed on the artist '
      + betByRound.artist
      + ' for the next ' + rounds);
    this.myBets = JSON.parse(localStorage.getItem('myBets'));
    setTimeout(() => {
      this.snackBar.dismiss();
    }, 5000);
  }
}
