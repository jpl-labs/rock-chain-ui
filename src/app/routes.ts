import { HomepageComponent } from './pages/homepage';
import { AboutComponent } from './pages/about';
import { StandingsComponent } from './pages/standings';
import { PlayingComponent } from './pages/playing';
import { LoginPageComponent } from './pages/loginpage';
import { BetsComponent } from './pages/bets';

import { Routes } from '@angular/router';

export const ROCK_CHAIN_ROUTES: Routes = [
    { path: '', component: HomepageComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent, pathMatch: 'full' },
    { path: 'standings', component: StandingsComponent, pathMatch: 'full' },
    { path: 'playing', component: PlayingComponent, pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent, pathMatch: 'full' },
    { path: 'bets', component: BetsComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
