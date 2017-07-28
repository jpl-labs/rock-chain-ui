import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FooterModule } from './shared/footer/footer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { AppComponent } from './app.component';
import { ROCK_CHAIN_ROUTES } from './routes';
import { HomepageComponent } from './pages/homepage/homepage';
import { NavBarComponent } from './shared/navbar/navbar';
import { NowPlayingComponent } from './cards/now-playing/now-playing.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { WalletComponent } from './cards/wallet/wallet.component';
import { CharityStandingsComponent } from './cards/charity-standings/charity-standings.component';
import { SongFeedbackComponent } from './dialogs/song-feedback/song-feedback.component';
import { RegistrationComponent, RegistrationDialogComponent } from './cards/registration/registration.component';
import { WagerService } from './services/wager.service';
import { BlockchainService } from './services/blockchain.service';
import { RegisterService } from './services/register.service';
import { WalletStandingsComponent } from './cards/wallet-standings/wallet-standings.component';
import { BetListComponent } from './cards/bet-list/bet-list.component';
import { FaqComponent } from './cards/faq/faq.component';
import { StandingsComponent } from './pages/standings/standings.component';
import { PlayingComponent } from './pages/playing/playing.component';
import { BetPlacementComponent } from './cards/bet-placement/bet-placement.component';

@NgModule({
    declarations: [
        AppComponent,
        NowPlayingComponent,
        HomeComponent,
        AboutComponent,
        WalletComponent,
        CharityStandingsComponent,
        HomepageComponent,
        NavBarComponent,
        RegistrationComponent,
        RegistrationDialogComponent,
        SongFeedbackComponent,
        WalletStandingsComponent,
        BetListComponent,
        FaqComponent,
        StandingsComponent,
        PlayingComponent,
        BetPlacementComponent
    ],
    entryComponents: [
        SongFeedbackComponent,
        RegistrationComponent,
        RegistrationDialogComponent,
        HomepageComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        FooterModule,
        RouterModule.forRoot(ROCK_CHAIN_ROUTES),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ],
    providers: [WagerService, BlockchainService, RegisterService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent]
})
export class AppModule { }
