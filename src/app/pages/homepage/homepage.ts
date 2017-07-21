import { Component, NgModule, OnInit } from '@angular/core';
import {
  MdButtonModule,
  MdListModule,
  MdIconModule,
  MdLineModule,
  MdCardModule,
  MdProgressBarModule
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

  canBeNumber = canBeNumber;

  wallet: Wallet;

  wagerService: WagerService;
  registerService: RegisterService;
  blockchainService: BlockchainService;

  constructor(
      private _wagerService: WagerService,
      private _registerService: RegisterService,
      private _blockchainService: BlockchainService) {
    this.registerService = _registerService;
    this.wagerService = _wagerService;
    this.blockchainService = _blockchainService;
  }

  ngOnInit() {
    const tmpWalletId = Cookie.get('walletId');

    this.wallet = {
        id: tmpWalletId,
        balance: this.blockchainService.getAccountBalance(tmpWalletId)
    };
    this.refreshBalance();

    const sub = this.registerService.getAccountRegisteredEmitter()
      .subscribe(result => console.log(result));
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
    this.wallet.id = this.blockchainService.web3.personal.newAccount(registration.password);
    Cookie.set('walletId', this.wallet.id);
    registration.wallet = this.wallet.id;

    this.registerService.registerAccount(registration);
  }

  refreshBalance = () => {
      this.wallet.balance = this.blockchainService.getAccountBalance(this.wallet.id);
  }
}
