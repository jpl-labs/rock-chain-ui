import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NavBarModule } from './shared/navbar/navbar';
import { FooterModule } from './shared/footer/footer';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import 'hammerjs';

import { AppComponent } from './app.component';
import { ROCK_CHAIN_ROUTES } from './routes';
import { HomepageComponent } from './pages/homepage/homepage';
import { NowPlayingComponent } from './cards/now-playing/now-playing.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { WalletComponent } from './cards/wallet/wallet.component';
import { CharityStandingsComponent } from './cards/charity-standings/charity-standings.component';
import { RegistrationComponent } from './cards/registration/registration.component';


@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    HomeComponent,
    AboutComponent,
    WalletComponent,
    CharityStandingsComponent,
    RegistrationComponent,
    HomepageComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    NavBarModule,
    FooterModule,
    RouterModule.forRoot(ROCK_CHAIN_ROUTES),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
