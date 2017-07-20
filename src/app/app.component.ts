import { Component, ViewChild, OnInit, NgModule } from '@angular/core';
import { MdSidenav, MdSidenavModule } from '@angular/material';
import { Router, RouterModule } from '@angular/router';
import * as Cookie from 'js-cookie';

const SMALL_WIDTH_BREAKPOINT = 840;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  walletId: string;

  constructor(private _router: Router) {
    this.walletId = Cookie.get('walletId');
  }

  @ViewChild(MdSidenav) sidenav: MdSidenav;

  ngOnInit() {
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
