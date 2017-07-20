import { HomepageComponent } from './pages/homepage';
import { AboutComponent } from './pages/about';

import { Routes } from '@angular/router';

export const ROCK_CHAIN_ROUTES: Routes = [
    { path: '', component: HomepageComponent, pathMatch: 'full' },
    { path: 'about', component: AboutComponent, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
