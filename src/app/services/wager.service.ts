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

import { providers, Transaction, AbstractBlock, SolidityEvent } from 'web3';

const contract = require('truffle-contract');


@Injectable()
export class WagerService {
  Wager = contract(Wager);
  instance: any;
  blockchainService: BlockchainService;

  private songChangedSource = new Subject<AudioSong>();
  private betPlacedSource = new Subject<SolidityEvent<any>>();
  private roundOverSource = new Subject<SolidityEvent<any>>();

  songChanged$ = this.songChangedSource.asObservable();
  betPlaced$ = this.betPlacedSource.asObservable();
  roundOver$ = this.roundOverSource.asObservable();

  constructor( @Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.setupContractWatchers();
    this.getWagerInstance();

    const lastSong = Observable.fromPromise(this.Wager.deployed())
      .mergeMap((instance: any) => Observable.fromPromise(instance.getLastSong()))
      .map(this.parseSongHex);

    const futureSongs = this.blockchainService.pendingTransaction$
      .do(console.log)
      .do(x => console.log(this.instance.address))
      .filter(result => result.to === this.instance.address
        && result.from === this.blockchainService.genesisAccount)
      .map(result => result.input)
      .map(this.parseSongHex);

    lastSong.concat(futureSongs).subscribe(this.songChangedSource);
  }

  parseSongHex = (hexString: string): AudioSong => {
    const jsonAscii = this.blockchainService.web3.toAscii(hexString.match(new RegExp('7b22.+227d'))[0]);
    console.log(JSON.parse(jsonAscii));
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
    '2Pac (Tupac)',
    'AC/DC',
    'Aerosmith',
    'Alice In Chains',
    'All Time Low',
    'America',
    'Bachman-Turner Overdrive',
    'Better Than Ezra',
    'Billy Squier',
    'Blink-182',
    'Blue October',
    'Blur',
    'Boston',
    'Bush',
    'Cinderella',
    'Collective Soul',
    'Cracker',
    'Crazy Town',
    'Cream',
    'Dead Or Alive',
    'Def Leppard',
    'Eagles',
    'Elton John',
    'Eve 6',
    'Everclear',
    'Firehouse',
    'Foo Fighters',
    'Foreigner',
    'Free',
    'Fuel',
    'Gin Blossoms',
    'Guns N\' Roses',
    'Jimmy Eat World',
    'Joan Jett',
    'Live',
    'Lynyrd Skynyrd',
    'Marcy Playground',
    'Matchbox Twenty',
    'Metallica',
    'Mötley Crüe',
    'Naughty By Nature',
    'Nirvana',
    'Oasis',
    'Ozzy Osbourne',
    'P.O.D.',
    'Pearl Jam',
    'Pink Floyd',
    'Scorpions',
    'Semisonic',
    'Smashing Pumpkins',
    'Soft Cell',
    'Soundgarden',
    'Staind',
    'Steve Miller Band',
    'Stone Temple Pilots',
    'Story Of The Year',
    'Styx',
    'Sublime',
    'Sugar Ray',
    'Tesla',
    'The Academy Is...',
    'The Allman Brothers Band',
    'The Cars',
    'The Doobie Brothers',
    'The Fray',
    'The Notorious B.I.G.',
    'The Offspring',
    'The Outfield',
    'The Police',
    'The Wallflowers',
    'Third Eye Blind',
    'Toadies',
    'Tonight Alive',
    'Toto',
    'Van Halen',
    'Weezer'
  ].sort();

}
