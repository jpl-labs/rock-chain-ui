import { Balance } from './Balance';

export interface Charity {
    id: number;
    name: string;
    amount: number;
    backers: number;
    icon: string;
    backerAccounts: Balance[];
}
