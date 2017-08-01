import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Bet, BetByRound } from '../../models/Bet';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';
import * as Cookie from 'js-cookie';

const contract = require('truffle-contract');

@Injectable()
export class WagerService {
  Wager = contract(Wager);
  instance: any;
  blockchainService: BlockchainService;
  betPlaced: EventEmitter<any> = new EventEmitter();
  roundOver: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.setupContractWatchers();
    this.getWagerInstance();
  }

  setupContractWatchers = () => {
    this.Wager.deployed().then((instance) => {
      const betPlaced = instance.BetPlaced();

      betPlaced.watch((error, result) => {
        if (!error) {
          this.betPlaced.emit(result);
        }
      });

      const roundOver = instance.RoundOver();

      roundOver.watch((error, result) => {
        if (!error) {
          this.roundOver.emit(result);
        }
      });
    });
  }

  getBetPlacedEmitter = () => {
    return this.betPlaced;
  }

  getRoundOverEmitter = () => {
    return this.roundOver;
  }

  getWagerInstance = (): any => {
    this.Wager.deployed().then((instance) => {
      this.instance = instance;
    });
  }

  getLastSong = (): Observable<string> => {
    return Observable.fromPromise(this.Wager.deployed())
      .mergeMap((instance: any) => Observable.fromPromise(instance.getLastSong()));
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

      this.blockchainService.web3.personal.unlockAccount(wallet, pKey, 2);
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
