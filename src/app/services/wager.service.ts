import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Bet, BetByRound } from '../../models/Bet';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise.js';
import 'rxjs/add/operator/do.js';
import 'rxjs/add/operator/concat.js';
import { BigNumber } from 'bignumber.js';

import { providers, Transaction, AbstractBlock, SolidityEvent } from 'web3';

const contract = require('truffle-contract');


@Injectable()
export class WagerService {
  Wager = contract(Wager);
  instance: any;

  private songChangedSource = new BehaviorSubject<AudioSong>({} as AudioSong);
  private betPlacedSource = new Subject<SolidityEvent<any>>();
  private roundOverSource = new Subject<SolidityEvent<any>>();

  songChanged$ = this.songChangedSource.asObservable();
  betPlaced$ = this.betPlacedSource.asObservable();
  roundOver$ = this.roundOverSource.asObservable();

  constructor(private blockchainService: BlockchainService) {
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.getWagerInstance();
    this.setupContractWatchers();

    const lastSong = Observable.fromPromise(this.Wager.deployed())
      .mergeMap((instance: any) => Observable.fromPromise(instance.getLastSong()))
      .map(this.parseSongHex);

    const futureSongs = this.blockchainService.pendingTransaction$
      .filter(result => result.to === this.instance.address
        && result.from === this.blockchainService.genesisAccount)
      .map(result => result.input)
      .map(this.parseSongHex);

    lastSong.concat(futureSongs).subscribe(this.songChangedSource);
  }

  parseSongHex = (hexString: string): AudioSong => {
    const jsonAscii = this.blockchainService.web3.toAscii(hexString.match(new RegExp('7b22.+227d'))[0]);
    return JSON.parse(jsonAscii);
  }

  setupContractWatchers = () => {
    this.Wager.deployed().then((instance) => {
      const betPlaced = instance.BetPlaced();

      betPlaced.watch((error, result) => {
        if (!error) {
          this.betPlacedSource.next(result);
        }
      });

      const roundOver = instance.RoundOver();

      roundOver.watch((error, result) => {
        if (!error) {
          this.roundOverSource.next(result);
        }
      });
    });
  }

  getWagerInstance = (): any => {
    this.Wager.deployed().then((instance) => {
      this.instance = instance;
    });
  }

  getRoundNumber = (): Observable<BigNumber> => {
    return Observable.from(this.Wager.deployed().then((instance) => {
      return instance.roundNumber();
    }));
  }

  placeBet = (bet: Bet) => {
    this.Wager.deployed().then((instance) => {
      const artist = bet.artist;
      const pKey = bet.password;
      const wallet = bet.walletId;

      this.blockchainService.web3.personal.unlockAccount(wallet, pKey, 2);
      instance.bet.sendTransaction(
        this.blockchainService.web3.toHex(artist),
        {
          from: wallet,
          to: instance.address,
          value: this.blockchainService.web3.toWei(1, 'ether'),
          gas: 4712388
        }
      );
    });
  }

  placeBetMultiRounds = (betByRound: BetByRound) => {
    this.Wager.deployed().then((instance) => {
      const artist = betByRound.artist;
      const pKey = betByRound.password;
      const wallet = betByRound.walletId;
      const numberOfRounds = betByRound.numberOfRounds;

      instance.betFuture.sendTransaction(
        this.blockchainService.web3.toHex(artist),
        numberOfRounds,
        {
          from: wallet,
          to: instance.address,
          value: this.blockchainService.web3.toWei(numberOfRounds, 'ether'),
          gas: 4712388
        }
      );
    });
  }

  artists = ['2Pac (Tupac)',
    '3 Doors Down',
    '311',
    '4 Non Blondes',
    'AC/DC',
    'Aerosmith',
    'Alanis Morissette',
    'Alice In Chains',
    'All Time Low',
    'America',
    'Bachman-Turner Overdrive',
    'Bad Company',
    'Barenaked Ladies',
    'Better Than Ezra',
    'Billy Squier',
    'Blink-182',
    'Blue October',
    'Blue Oyster Cult',
    'Blues Traveler',
    'Blur',
    'Bob Seger & The Silver Bullet Band',
    'Boston',
    'Bush',
    'Cake',
    'Candlebox',
    'Chumbawamba',
    'Cinderella',
    'Coldplay',
    'Collective Soul',
    'Counting Crows',
    'Cracker',
    'Crazy Town',
    'Cream',
    'Dave Matthews Band',
    'Dead Or Alive',
    'Deep Blue Something',
    'Def Leppard',
    'Del Amitri',
    'Dido',
    'Duncan Sheik',
    'Eagle-Eye Cherry',
    'Eagles',
    'Elton John',
    'Eve 6',
    'Everclear',
    'Fastball',
    'Fiona Apple',
    'Firehouse',
    'Five Finger Death Punch',
    'Fleetwood Mac',
    'Foo Fighters',
    'Foreigner',
    'Free',
    'Fuel',
    'Gin Blossoms',
    'Green Day',
    'Guns N\' Roses',
    'Harvey Danger',
    'Hole',
    'Hootie & The Blowfish',
    'Incubus',
    'Jimmy Eat World',
    'Joan Jett',
    'Johnny Cash',
    'Journey',
    'Led Zeppelin',
    'Lisa Loeb',
    'Live',
    'Lynyrd Skynyrd',
    'Marcy Playground',
    'Matchbox Twenty',
    'Metallica',
    'Mötley Crüe',
    'Natalie Imbruglia',
    'Naughty By Nature',
    'Nine Inch Nails',
    'Nirvana',
    'No Doubt',
    'Norman Greenbaum',
    'Oasis',
    'Orgy',
    'Ozzy Osbourne',
    'P.O.D.',
    'Pearl Jam',
    'Pink Floyd',
    'Queen',
    'Red Hot Chili Peppers',
    'Rob Zombie',
    'Scorpions',
    'Semisonic',
    'Seven Mary Three',
    'Sheryl Crow',
    'Silverchair',
    'Smash Mouth',
    'Smashing Pumpkins',
    'Soft Cell',
    'Soundgarden',
    'Spacehog',
    'Spin Doctors',
    'Staind',
    'Steve Miller Band',
    'Stone Temple Pilots',
    'Story Of The Year',
    'Styx',
    'Sublime',
    'Sugar Ray',
    'Tal Bachman',
    'Temple Of The Dog',
    'Tesla',
    'The Academy Is...',
    'The Allman Brothers Band',
    'The Black Crowes',
    'The Cars',
    'The Cranberries',
    'The Cure',
    'The Doobie Brothers',
    'The Fray',
    'The Goo Goo Dolls',
    'The Notorious B.I.G.',
    'The Offspring',
    'The Outfield',
    'The Police',
    'The Presidents Of The United States Of America',
    'The Verve Pipe',
    'The Wallflowers',
    'Third Eye Blind',
    'Toad The Wet Sprocket',
    'Toadies',
    'Tom Petty',
    'Tonic',
    'Tonight Alive',
    'Tool',
    'Toto',
    'Tracy Chapman',
    'Train',
    'Van Halen',
    'Vertical Horizon',
    'Weezer',
  ].sort();

}
