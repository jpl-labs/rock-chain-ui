import { Component, ViewChild, OnInit, NgModule } from '@angular/core';
import { MdSidenav, MdSidenavModule, MdChipsModule } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import { Wallet } from '../models/Wallet';
import { BlockchainService } from './services/blockchain.service';
import { WagerService } from './services/wager.service';
import { AudioSong } from '../models/PlayerStatus';

const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  wallet: Wallet;

  currentSong: AudioSong = {
    artist: '',
    title: '',
    album: '',
    cover: '',
    feedback: '',
    allowFeedback: true,
    sleep: false,
    id: '',
    style: ''
  };

  blockchainService: BlockchainService;
  wagerService: WagerService;

  constructor(
    private _router: Router,
    private _blockchainService: BlockchainService,
    private _wagerService: WagerService) {
    this.blockchainService = _blockchainService;
    this.wagerService = _wagerService;
  }

  @ViewChild(MdSidenav) sidenav: MdSidenav;

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

    const songSub = this.wagerService.songChanged$
      .subscribe(song => this.currentSong = song);

    this._router.events.subscribe(() => {
      if (this.isScreenSmall()) {
        this.sidenav.close();
      }
    });
  }

  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
}
