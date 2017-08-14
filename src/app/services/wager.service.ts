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
    if (hexString === '0x') {
      return {
        album: '',
        allowFeedback: true,
        artist: '',
        cover: '',
        feedback: '',
        id: '',
        sleep: false,
        title: '',
        style: '',
      };
    }
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

  artists = [
    '3 Doors Down',
    '311',
    '4 Non Blondes',
    'A-Ha',
    'AC/DC',
    'Aerosmith',
    'Alanis Morissette',
    'Alice Cooper',
    'Alice In Chains',
    'America',
    'Autograph',
    'Bachman-Turner Overdrive',
    'Bad Company',
    'Barenaked Ladies',
    'Better Than Ezra',
    'Billy Idol',
    'Billy Joel',
    'Billy Squier',
    'Blink-182',
    'Blue Oyster Cult',
    'Blues Traveler',
    'Blur',
    'Bob Seger & The Silver Bullet Band',
    'Bon Jovi',
    'Boston',
    'Bush',
    'Cake',
    'Candlebox',
    'Cat Stevens',
    'Chumbawamba',
    'Cinderella',
    'Coldplay',
    'Collective Soul',
    'Counting Crows',
    'Cracker',
    'Daryl Hall & John Oates',
    'Dave Matthews Band',
    'Deep Blue Something',
    'Def Leppard',
    'Del Amitri',
    'Dido',
    'Dire Straits',
    'Don Henley',
    'Don McLean',
    'Duncan Sheik',
    'Eagle-Eye Cherry',
    'Eagles',
    'Electric Light Orchestra',
    'Elton John',
    'Eric Clapton',
    'Eve 6',
    'Everclear',
    'Fastball',
    'Fiona Apple',
    'Fleetwood Mac',
    'Foo Fighters',
    'Foreigner',
    'Free',
    'Fuel',
    'Gin Blossoms',
    'Grand Funk Railroad',
    'Green Day',
    'Gregg Allman',
    'Guns N\' Roses',
    'Harvey Danger',
    'Heart',
    'Hole',
    'Hootie & The Blowfish',
    'Incubus',
    'Joan Jett',
    'John Mellencamp',
    'Johnny Cash',
    'Journey',
    'Led Zeppelin',
    'Lisa Loeb',
    'Live',
    'Loverboy',
    'Lynyrd Skynyrd',
    'Marcy Playground',
    'Matchbox Twenty',
    'Metallica',
    'Mötley Crüe',
    'Natalie Imbruglia',
    'Neil Young',
    'Nine Inch Nails',
    'Nirvana',
    'No Doubt',
    'Norman Greenbaum',
    'Oasis',
    'Orgy',
    'Ozzy Osbourne',
    'Pat Benatar',
    'Pearl Jam',
    'Pink Floyd',
    'Poison',
    'Pure Prairie League',
    'Queen',
    'Quiet Riot',
    'Red Hot Chili Peppers',
    'REO Speedwagon',
    'Rob Zombie',
    'Scorpions',
    'Semisonic',
    'Seven Mary Three',
    'Sheryl Crow',
    'Silverchair',
    'Simple Minds',
    'Skid Row',
    'Smash Mouth',
    'Smashing Pumpkins',
    'Soundgarden',
    'Spacehog',
    'Spin Doctors',
    'Steve Miller Band',
    'Stone Temple Pilots',
    'Styx',
    'Sublime',
    'Sugar Ray',
    'Supertramp',
    'T. Rex (Tyrannosaurus Rex)',
    'Tal Bachman',
    'Temple Of The Dog',
    'The Allman Brothers Band',
    'The Black Crowes',
    'The Cars',
    'The Cranberries',
    'The Cure',
    'The Doobie Brothers',
    'The Goo Goo Dolls',
    'The Marshall Tucker Band',
    'The Offspring',
    'The Outfield',
    'The Police',
    'The Presidents Of The United States Of America',
    'The Rolling Stones',
    'The Verve Pipe',
    'The Wallflowers',
    'Thin Lizzy',
    'Third Eye Blind',
    'Toad The Wet Sprocket',
    'Toadies',
    'Tom Petty',
    'Tonic',
    'Tool',
    'Tracy Chapman',
    'Train',
    'Van Halen',
    'Vertical Horizon',
    'War',
    'Weezer'
  ].sort();

}
