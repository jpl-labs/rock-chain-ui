export interface Bet {
    password: string;
    artist: string;
    walletId: string;
}

export interface BetByRound {
    password: string;
    artist: string;
    walletId: string;
    numberOfRounds: number;
}

export interface PlacedBet {
    from: string;
    artist: string;
    roundNum: number;
    pot: number;
}
