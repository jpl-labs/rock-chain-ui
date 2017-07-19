import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { NavBarModule } from './shared/navbar/navbar';
import { FooterModule } from './shared/footer/footer';

import { RouterModule } from '@angular/router';

import 'hammerjs';

import { AppComponent } from './app.component';
import { ROCK_CHAIN_ROUTES } from './routes';
import { HomepageModule } from './pages/homepage/homepage';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    NavBarModule,
    FooterModule,
    RouterModule.forRoot(ROCK_CHAIN_ROUTES),
    HomepageModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
