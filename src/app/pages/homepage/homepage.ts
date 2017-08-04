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
import { Bet, PlacedBet, MyBet, BetByRound } from '../../../models/Bet';
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

  recentBets: PlacedBet[];

  canBeNumber = canBeNumber;

  wallet: Wallet;
  myBets: Array<MyBet>;

  constructor(
    public wagerService: WagerService,
    public registerService: RegisterService,
    public blockchainService: BlockchainService,
    private snackBar: MdSnackBar) {

    this.recentBets = new Array<PlacedBet>();
  }

  ngOnInit() {
    const tmpWallet = localStorage.getItem('walletId');
    if (tmpWallet) {
      this.wallet = {
          id: tmpWallet,
          balance: 0
      };
    }

    const regSub = this.registerService.getAccountRegisteredEmitter()
      .subscribe(result => result);

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
}
