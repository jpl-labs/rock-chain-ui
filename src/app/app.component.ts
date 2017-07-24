import { Component, ViewChild, OnInit, NgModule } from '@angular/core';
import { MdSidenav, MdSidenavModule } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import * as Cookie from 'js-cookie';
import { Wallet } from '../models/Wallet';
import { BlockchainService } from './services/blockchain.service';

const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  wallet: Wallet;

  blockchainService: BlockchainService;

  constructor(private _router: Router, private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
  }

  @ViewChild(MdSidenav) sidenav: MdSidenav;

  ngOnInit() {
    const tmpWallet = Cookie.get('walletId');
    if (tmpWallet) {
      this.wallet = {
        id: tmpWallet,
        balance: this.blockchainService.getAccountBalance(tmpWallet)
      };
    }


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
