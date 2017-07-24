import { Component, NgModule, OnInit } from '@angular/core';
import {
  MdButtonModule,
  MdListModule,
  MdIconModule,
  MdLineModule,
  MdCardModule,
  MdProgressBarModule,
  MdSnackBar
} from '@angular/material';
import { FooterModule } from '../../shared/footer/footer';
import { RouterModule } from '@angular/router';
import { AudioSong } from '../../../models/PlayerStatus';
import { Wallet } from '../../../models/Wallet';
import { Wager, Register } from 'tc2017-contract-artifacts';
import { canBeNumber } from '../../../util/validation';
import * as Cookie from 'js-cookie';
import { RegistrationComponent } from '../../cards/registration/registration.component';
import { Registration } from '../../../models/Registration';
import { Bet, PlacedBet } from '../../../models/Bet';
import { WagerService } from '../../services/wager.service';
import { RegisterService } from '../../services/register.service';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.html',
    styleUrls: ['./homepage.scss']
})
export class HomepageComponent implements OnInit {
  betArtist: string;
  pKey: string;

  currentSong: AudioSong;
  recentBets: PlacedBet[];

  canBeNumber = canBeNumber;

  wallet: Wallet;

  wagerService: WagerService;
  registerService: RegisterService;
  blockchainService: BlockchainService;
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
  }

  ngOnInit() {
    const tmpWallet = Cookie.get('walletId');
    if (tmpWallet) {
      this.wallet = {
        id: tmpWallet,
        balance: this.blockchainService.getAccountBalance(tmpWallet)
      };
    }

    const regSub = this.registerService.getAccountRegisteredEmitter()
      .subscribe(result => console.log(result));

    const songSub = this.blockchainService.getSongChangedEmitter()
      .subscribe(result => {
        if (result.to === this.wagerService.instance.address
          && result.from === this.blockchainService.web3.eth.accounts[0]) {
          const jsonAscii = this.blockchainService.web3.toAscii(result.input.match(new RegExp('7b22.+227d'))[0]);
          const songData = JSON.parse(jsonAscii);
          this.currentSong = songData;
        }
      });

    const betSub = this.wagerService.getBetPlacedEmitter()
      .subscribe(result => {
        this.recentBets.push(result);
        const snackBarRef = this.snackBar.open(result.args.from
            + ' just placed a bet on '
            + result.args.artist
            + ', bringing the total pot to '
            + this.blockchainService.web3.fromWei(result.args.totalPot, 'ether')
            + ' OmniCoin');
      });
  }

  placeBet = () => {
    this.wagerService.placeBet(
      {
        artist: this.betArtist,
        walletId: this.wallet.id,
        password: this.pKey
      });
  }

  like = (song: AudioSong) => {
      console.log('liked');
      console.log(song);
  }

  dislike = (song: AudioSong) => {
      console.log('disliked');
      console.log(song);
  }

  registerAccount = (registration: Registration) => {
    const newAcct = this.blockchainService.web3.personal.newAccount(registration.password);
    this.wallet = {
      id: newAcct,
      balance: this.blockchainService.getAccountBalance(newAcct)
    };
    Cookie.set('walletId', this.wallet.id);
    registration.wallet = this.wallet.id;

    this.registerService.registerAccount(registration);
  }
}
