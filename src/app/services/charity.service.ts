import { Charity } from '../../models/Charity';

import { Injectable } from '@angular/core';

@Injectable()
export class CharityService {
    charities = [
        {
        id: 0,
        name: 'Humane Society',
        amount: 0,
        backers: 0,
        backerAccounts: [],
        icon: 'hsi'
        },
        {
        id: 1,
        name: 'Make-A-Wish',
        amount: 0,
        backers: 0,
        backerAccounts: [],
        icon: 'maw'
        },
        {
        id: 2,
        name: 'Electronic Frontier Foundation',
        amount: 0,
        backers: 0,
        backerAccounts: [],
        icon: 'eff'
        }
    ];

    charityNames = ['Humane Society', 'Make-A-Wish', 'Electronic Frontier Foundation'];

    icon = ['hsi', 'maw', 'eff'];

    getCharityFromIndex = (index:number) : Charity => {
        return this.charities[index];
    };

    getCharityIconFromIndex = (index:number) : string => {
        return this.charities[index].icon;
    };

    getCharityNameFromIndex = (index:number) : string => {
        return this.charities[index].name;
    };
}
