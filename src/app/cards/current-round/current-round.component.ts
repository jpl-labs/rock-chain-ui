import { Component, OnInit } from '@angular/core';
import {
  MdSnackBar
} from '@angular/material';
import { WagerService } from '../../services/wager.service';
import { RegisterService } from '../../services/register.service';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeLast';
const Filter = require('bad-words');

@Component({
  selector: 'app-current-round',
  templateUrl: './current-round.component.html',
  styleUrls: ['./current-round.component.css']
})
export class CurrentRoundComponent implements OnInit {
  wagerService: WagerService;
  registerService: RegisterService;
  blockchainService: BlockchainService;

  betsArr: Array<{}>;
  recentBets: Array<{}>;

  winnersArr: Array<string>;
  recentWinners: Array<string>;

  roundNumber: string;
  roundPot: string;

  snackBar: MdSnackBar;

  filter: any;

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
    this.filter = new Filter();
  }

  ngOnInit() {
    this.wagerService.getRoundNumber().subscribe(num => {
      this.roundNumber = num.toNumber().toString();
    });

    if (localStorage.getItem('recentBets') && this.recentBets.length === 0) {
      const bets = JSON.parse(localStorage.getItem('recentBets'));
      for (let i = 0; i < bets.length; i ++) {
        if (this.betsArr.length >= 5) {
          this.betsArr.shift();
        }
        this.betsArr.push(bets[i]);
      }

      const winners = JSON.parse(localStorage.getItem('recentWinners'));
      for (let j = 0; j < winners.length; j++) {
        if (this.winnersArr.length >= 5) {
          this.winnersArr.shift();
        }
        this.winnersArr.push(winners[j]);
      }
    }

    const betSub = this.wagerService.betPlaced$
      .subscribe(result => {
        if (this.filter.isProfane(result.args.artist)) {
          return;
        }

        this.roundNumber = result.args.roundNum.toNumber().toString();
        this.roundPot = this.blockchainService.web3.fromWei(result.args.totalPot, 'ether');
        this.recentBets.push({
          wallet: result.args.from,
          artist: result.args.artist
        });

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

    const betSub2 = this.wagerService.betPlaced$
      .subscribe(result => {
        if (this.betsArr.length >= 5) {
          this.betsArr.shift();
        }
        this.betsArr.push({
          wallet: result.args.from,
          artist: result.args.artist
        });
      });

    const roundOverSub = this.wagerService.roundOver$
      .subscribe(result => {
        this.roundNumber = result.args.roundNumber.toNumber() + 1;
        const payout = parseInt(this.blockchainService.web3.fromWei(result.args.payout.toNumber(), 'ether'), 10);
        if (payout > 0 && result.args.winners.length > 0) {
          const songData = JSON.parse(result.args.songData);

          result.args.winners.forEach(element => {
            const winnerStr = `${songData.artist} wins for Ꮻ ${payout}
            to ${element.substring(0, 10)}...`;

            this.recentWinners.push(winnerStr);

            if (this.winnersArr.length >= 5) {
              this.winnersArr.shift();
            }

            this.winnersArr.push(winnerStr);

            if (element === localStorage.getItem('walletId')) {
              this.snackBar.open(`You won Ꮻ ${payout} because ${songData.artist} played!`);
              setTimeout(() => {
                this.snackBar.dismiss();
              }, 15000);
            }
          });
          localStorage.setItem('recentWinners', JSON.stringify(this.recentWinners));

        }
      });
  }
}
