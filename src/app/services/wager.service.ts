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
import { Wallet } from '../../models/Wallet';

import { providers, Transaction, AbstractBlock, SolidityEvent } from 'web3';

const contract = require('truffle-contract');

@Injectable()
export class WagerService {
  Wager = contract(Wager);
  instance: any;

  private betPlacedSource = new Subject<SolidityEvent<any>>();
  private balanceUpdatedSource = new Subject<Wallet>();
  private roundOverSource = new Subject<SolidityEvent<any>>();

  songChanged$: Observable<AudioSong>;
  betPlaced$ = this.betPlacedSource.asObservable();
  balanceUpdated$ = this.balanceUpdatedSource.asObservable();
  roundOver$ = this.roundOverSource.asObservable();
  currentRound$: Observable<BigNumber>;

  constructor(private blockchainService: BlockchainService) {
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.getWagerInstance();
    this.setupContractWatchers();

    const lastSong = Observable.fromPromise(this.Wager.deployed())
      .mergeMap((instance: any) => Observable.fromPromise(instance.getLastSong()));

    const futureSongs = this.blockchainService.pendingTransaction$
      .filter(result => result.to === this.instance.address
        && result.from === this.blockchainService.genesisAccount)
      .map(result => result.input);

    this.songChanged$ = lastSong.concat(futureSongs).map(this.parseSongHex);

    const roundNumber = this.getRoundNumber();

    const balance = this.blockchainService.getAccountBalance(localStorage.getItem('walletId'))
      .map(b => ({ id: localStorage.getItem('walletId'), balance: b } as Wallet));

    const futureBalances$ = this.betPlaced$.mergeMap(x => {
      const wallet = localStorage.getItem('walletId');
      return this.blockchainService.getAccountBalance(wallet).map(b => ({ id: wallet, balance: b } as Wallet));
    });

    this.balanceUpdated$ = balance.concat(futureBalances$);

    this.currentRound$ = roundNumber.concat(this.roundOver$.map((result): BigNumber => result.args.roundNumber.plus(1)));
  }

  parseSongHex = (hexString: string): AudioSong => {
    return JSON.parse(this.blockchainService.web3.toAscii(hexString.match(new RegExp('7b22.+227d'))[0]));
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

  artists = ['AC/DC',
    'Aerosmith',
    'America',
    'Bachman-Turner Overdrive',
    'Bad Company',
    'Billy Joel',
    'Blue Oyster Cult',
    'Bob Seger & The Silver Bullet Band',
    'Boston',
    'Cat Stevens',
    'Daryl Hall & John Oates',
    'Don McLean',
    'Eagles',
    'Electric Light Orchestra',
    'Elton John',
    'Eric Clapton',
    'Fleetwood Mac',
    'Foreigner',
    'Free',
    'Gregg Allman',
    'Heart',
    'Journey',
    'Led Zeppelin',
    'Lynyrd Skynyrd',
    'Neil Young',
    'Norman Greenbaum',
    'Pink Floyd',
    'Steve Miller Band',
    'Styx',
    'Supertramp',
    'T. Rex (Tyrannosaurus Rex)',
    'The Allman Brothers Band',
    'The Doobie Brothers',
    'The Marshall Tucker Band',
    'The Rolling Stones',
    'Thin Lizzy',
    'War',
    'A-Ha',
    'AC/DC',
    'Aerosmith',
    'Alice Cooper',
    'Autograph',
    'Billy Idol',
    'Billy Squier',
    'Bon Jovi',
    'Cinderella',
    'Def Leppard',
    'Don Henley',
    'Foreigner',
    'Guns N\' Roses',
    'Joan Jett',
    'John Mellencamp',
    'Loverboy',
    'Mötley Crüe',
    'Ozzy Osbourne',
    'Pat Benatar',
    'Poison',
    'Quiet Riot',
    'REO Speedwagon',
    'Scorpions',
    'Simple Minds',
    'Skid Row',
    'The Outfield',
    'The Police',
    'Tom Petty',
    'Van Halen',
    '3 Doors Down',
    '311',
    '4 Non Blondes',
    'Alanis Morissette',
    'Alice In Chains',
    'Barenaked Ladies',
    'Better Than Ezra',
    'Blink-182',
    'Blues Traveler',
    'Blur',
    'Bush',
    'Cake',
    'Candlebox',
    'Chumbawamba',
    'Coldplay',
    'Collective Soul',
    'Counting Crows',
    'Cracker',
    'Dave Matthews Band',
    'Deep Blue Something',
    'Del Amitri',
    'Dido',
    'Duncan Sheik',
    'Eagle-Eye Cherry',
    'Eve 6',
    'Everclear',
    'Fastball',
    'Fiona Apple',
    'Fleetwood Mac',
    'Foo Fighters',
    'Fuel',
    'Gin Blossoms',
    'Green Day',
    'Harvey Danger',
    'Hole',
    'Hootie & The Blowfish',
    'Incubus',
    'Johnny Cash',
    'Lisa Loeb',
    'Live',
    'Marcy Playground',
    'Matchbox Twenty',
    'Metallica',
    'Natalie Imbruglia',
    'Nine Inch Nails',
    'Nirvana',
    'No Doubt',
    'Oasis',
    'Orgy',
    'Pearl Jam',
    'Queen',
    'Red Hot Chili Peppers',
    'Rob Zombie',
    'Semisonic',
    'Seven Mary Three',
    'Sheryl Crow',
    'Silverchair',
    'Smash Mouth',
    'Smashing Pumpkins',
    'Soundgarden',
    'Spacehog',
    'Spin Doctors',
    'Stone Temple Pilots',
    'Sublime',
    'Sugar Ray',
    'Tal Bachman',
    'Temple Of The Dog',
    'The Black Crowes',
    'The Cranberries',
    'The Cure',
    'The Goo Goo Dolls',
    'The Offspring',
    'The Presidents Of The United States Of America',
    'The Verve Pipe',
    'The Wallflowers',
    'Third Eye Blind',
    'Toad The Wet Sprocket',
    'Toadies',
    'Tom Petty',
    'Tonic',
    'Tool',
    'Tracy Chapman',
    'Train',
    'Vertical Horizon',
    'Weezer'
  ].sort();

}
