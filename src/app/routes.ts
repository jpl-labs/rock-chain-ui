import { HomepageComponent } from './pages/homepage';
import { AboutComponent } from './pages/about';
import { StandingsComponent } from './pages/standings';
import { PlayingComponent } from './pages/playing';

import { Routes } from '@angular/router';

export const ROCK_CHAIN_ROUTES: Routes = [
    { path: '', component: HomepageComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent, pathMatch: 'full' },
    { path: 'standings', component: StandingsComponent, pathMatch: 'full' },
    { path: 'playing', component: PlayingComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
