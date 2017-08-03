import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  MdSnackBar
} from '@angular/material';
import { WagerService } from '../../services/wager.service';
import { RegisterService } from '../../services/register.service';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeLast';
import { Subscription } from 'rxjs/Subscription';

const Filter = require('bad-words');

@Component({
  selector: 'app-current-round',
  templateUrl: './current-round.component.html',
  styleUrls: ['./current-round.component.css']
})
export class CurrentRoundComponent implements OnInit, OnDestroy {
  wagerService: WagerService;
  registerService: RegisterService;
  blockchainService: BlockchainService;

  betsArr: Array<{}>;
  recentBets: Array<{}>;

  winnersArr: Array<{}>;
  recentWinners: Array<{}>;

  roundNumber: string;
  roundPot: string;

  snackBar: MdSnackBar;

  filter: any;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private _wagerService: WagerService,
    private _registerService: RegisterService,
    private _blockchainService: BlockchainService,
    private _snackBar: MdSnackBar) {
    this.registerService = _registerService;
    this.wagerService = _wagerService;
    this.blockchainService = _blockchainService;
    this.snackBar = _snackBar;
    this.recentBets = new Array<{}>();
    this.betsArr = new Array<{}>();
    this.recentWinners = new Array<{}>();
    this.winnersArr = new Array<{}>();
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
      for (let i = 0; i < bets.length; i++) {
        if (this.betsArr.length >= 10) {
          this.betsArr.shift();
        }
        this.betsArr.push(bets[i]);
      }

      const winners = JSON.parse(localStorage.getItem('recentWinners'));

      if (winners) {
        for (let j = 0; j < winners.length; j++) {
          if (this.winnersArr.length >= 10) {
            this.winnersArr.shift();
          }
          this.winnersArr.push(winners[j]);
        }
      }
    }

    this.subscriptions.push(this.wagerService.betPlaced$
      .subscribe(result => {
        if (this.filter.isProfane(result.args.artist)) {
          return;
        }

        this.roundNumber = result.args.roundNum.toNumber().toString();
        this.roundPot = this.blockchainService.web3.fromWei(result.args.totalPot, 'ether');

        if (localStorage.getItem('recentBets')) {
          this.recentBets = JSON.parse(localStorage.getItem('recentBets'));
        }

        this.recentBets.unshift({
          wallet: result.args.from,
          artist: result.args.artist
        });

        localStorage.setItem('recentBets', JSON.stringify(this.recentBets));

        const snackBarRef = this.snackBar.open(result.args.from
          + ' just placed a bet on '
          + result.args.artist
          + ', bringing the total pot to '
          + this.blockchainService.web3.fromWei(result.args.totalPot, 'ether')
          + ' OmniCoin', '', {
            duration: 5000
          });
      }));

    this.subscriptions.push(this.wagerService.betPlaced$
      .subscribe(result => {
        if (this.betsArr.length >= 5) {
          this.betsArr.pop();
        }
        this.betsArr.unshift({
          wallet: result.args.from,
          artist: result.args.artist
        });
      }));

    this.subscriptions.push(this.wagerService.roundOver$
      .subscribe(result => {
        this.roundNumber = result.args.roundNumber.toNumber() + 1;
        this.roundPot = this.blockchainService.web3.fromWei(result.args.totalPot.toNumber(), 'ether');
        const payout = parseInt(this.blockchainService.web3.fromWei(result.args.payout.toNumber(), 'ether'), 10);
        if (payout > 0 && result.args.winners.length > 0) {
          const songData = JSON.parse(result.args.songData);

          result.args.winners.forEach(element => {
            this.recentWinners.unshift({
              wallet: element,
              win: `${songData.artist}  for Ꮻ ${payout}`
            });

            if (this.winnersArr.length >= 5) {
              this.winnersArr.pop();
            }

            this.winnersArr.unshift({
              wallet: element,
              win: `${songData.artist}  for Ꮻ ${payout}`
            });

            if (element === localStorage.getItem('walletId')) {
              this.snackBar.open(`You won Ꮻ ${payout} because ${songData.artist} played!`, '', {
                duration: 15000
              });
            }
          });
          localStorage.setItem('recentWinners', JSON.stringify(this.recentWinners));

        }
      }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
