import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NavBarModule } from './shared/navbar/navbar';
import { FooterModule } from './shared/footer/footer';

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
import { SongFeedbackComponent } from './dialogs/song-feedback/song-feedback.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    HomeComponent,
    AboutComponent,
    WalletComponent,
    CharityStandingsComponent,
    HomepageComponent,
    SongFeedbackComponent
  ],
  entryComponents: [
    SongFeedbackComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    NavBarModule,
    FooterModule,
    RouterModule.forRoot(ROCK_CHAIN_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
