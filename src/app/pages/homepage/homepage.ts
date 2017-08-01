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
import { RegistrationComponent } from '../../cards/registration/registration.component';
import { Registration } from '../../../models/Registration';
import { Bet, PlacedBet, BetByRound } from '../../../models/Bet';
import { WagerService } from '../../services/wager.service';
import { RegisterService } from '../../services/register.service';
import { BlockchainService } from '../../services/blockchain.service';
import { BetPlacementComponent } from '../../cards/bet-placement/bet-placement.component';

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
    this.recentBets = new Array<PlacedBet>();
  }

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

    const regSub = this.registerService.getAccountRegisteredEmitter()
      .subscribe(result => result);

    this.wagerService.getLastSong()
      .subscribe(result => {
        const jsonAscii = this.blockchainService.web3.toAscii(result.match(new RegExp('7b22.+227d'))[0]);
        const songData = JSON.parse(jsonAscii);
        this.currentSong = songData;
      });

    const songSub = this.blockchainService.getSongChangedEmitter()
      .subscribe(result => {
        if (result.to === this.wagerService.instance.address
          && result.from === this.blockchainService.getGenesisAccount()) {
          const jsonAscii = this.blockchainService.web3.toAscii(result.input.match(new RegExp('7b22.+227d'))[0]);
          const songData = JSON.parse(jsonAscii);
          this.currentSong = songData;
        }
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

    this.blockchainService.getAccountBalance(newAcct).subscribe(balance => {
      this.wallet = {
        id: newAcct,
        balance: balance
      };
      localStorage.setItem('walletId', this.wallet.id);
      registration.wallet = this.wallet.id;
      this.registerService.registerAccount(registration);
    });
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
      setTimeout(() => {
        this.snackBar.dismiss();
      }, 5000);
  }
}
