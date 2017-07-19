import { Homepage } from './pages/homepage';

import { Routes } from '@angular/router';

export const ROCK_CHAIN_ROUTES: Routes = [
    { path: '', component: Homepage, pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];
