import { Component, OnInit } from '@angular/core';
import {
  MdSnackBar
} from '@angular/material';
import { WagerService } from '../../services/wager.service';
import { RegisterService } from '../../services/register.service';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeLast';

@Component({
  selector: 'app-current-round',
  templateUrl: './current-round.component.html',
  styleUrls: ['./current-round.component.css']
})
export class CurrentRoundComponent implements OnInit {
  wagerService: WagerService;
  registerService: RegisterService;
  blockchainService: BlockchainService;

  betsArr: Array<string>;
  recentBets: Array<string>;

  winnersArr: Array<string>;
  recentWinners: Array<string>;

  roundNumber: string;
  roundPot: string;

  snackBar: MdSnackBar;

  constructor(
    private _wagerService: WagerService,
    private _registerService: RegisterService,
    private _blockchainService: BlockchainService,
    private _snackBar: MdSnackBar) {
    this.registerService = _registerService;
    this.wagerService = _wagerService;
    this.blockchainService = _blockchainService;
    this.snackBar = _snackBar;
    this.recentBets = new Array<string>();
    this.betsArr = new Array<string>();
    this.recentWinners = new Array<string>();
    this.winnersArr = new Array<string>();
    this.roundNumber = 'Waiting for blockchain to update...';
    this.roundPot = 'Waiting for blockchain to update...';
  }

  ngOnInit() {
    if (localStorage.getItem('recentBets') && this.recentBets.length === 0) {
      const bets = JSON.parse(localStorage.getItem('recentBets'));
      for (let i = 0; i < bets.length; i ++) {
        this.betsArr.push(bets[i]);
      }
    }

    const betSub = this.wagerService.getBetPlacedEmitter()
      .subscribe(result => {
        this.roundNumber = result.args.roundNum.toNumber().toString();
        this.roundPot = this.blockchainService.web3.fromWei(result.args.totalPot, 'ether');
        this.recentBets.push(result.args.from.substring(0, 20) + '... => ' + result.args.artist);

        localStorage.setItem('recentBets', JSON.stringify(this.recentBets));

        const snackBarRef = this.snackBar.open(result.args.from
          + ' just placed a bet on '
          + result.args.artist
          + ', bringing the total pot to '
          + this.blockchainService.web3.fromWei(result.args.totalPot, 'ether')
          + ' OmniCoin');

        setTimeout(() => {
          this.snackBar.dismiss();
        }, 5000);
      });

    const betSub2 = this.wagerService.getBetPlacedEmitter()
      .subscribe(result => {
        if (this.betsArr.length >= 5) {
          this.betsArr.shift();
        }
        this.betsArr.push(result.args.from.substring(0, 20) + '... => ' + result.args.artist);
      });

    const roundOverSub = this.wagerService.getRoundOverEmitter()
      .subscribe(result => {
        const payout = parseInt(this.blockchainService.web3.fromWei(result.args.payout.toNumber(), 'ether'), 10);
        if (payout > 0) {
          const winnerStr = `${result.args.artist} for Ꮻ ${result.args.payout}
            \n ${result.args.winners.foreach(winner => winner.substring(0, 10) + ',')} \n`;

          this.recentWinners.push(winnerStr);

          localStorage.setItem('recentWinners', JSON.stringify(this.recentWinners));

          if (this.winnersArr.length >= 5) {
            this.winnersArr.shift();
          }

          this.winnersArr.push(winnerStr);

          result.args.winners.forEach(element => {
            if (element === localStorage.getItem('walletId')) {
              this.snackBar.open(`You won Ꮻ ${result.args.payout} because ${result.args.artist} played!`);
              setTimeout(() => {
                this.snackBar.dismiss();
              }, 15000);
            }
          });
        }
      });
  }
}
