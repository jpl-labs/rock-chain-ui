import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Bet, BetByRound } from '../../models/Bet';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';

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
    'Emancipator',
    'Daft Punk',
    'Kyle Dixon & Michael Stein',
    'Nightmares On Wax',
    'Luis Fonsi & Daddy Yankee',
    'Tycho',
    'The xx',
    'Port Blue',
    'Don Omar',
    'Decco',
    'Alex Midi',
    'Daddy Yankee',
    'J-Kwon',
    'Yntendo & Sam F',
    'Alesso',
    'Russ',
    'Ice Cube',
    'The Notorious B.I.G.',
    'Cypress Hill',
    'Dr. Dre',
    '2Pac (Tupac)',
    'Juvenile',
    'Snoop Dogg',
    'Ginuwine',
    'Bone Thugs-N-Harmony',
    'Tag Team',
    'DMX',
    'Drake',
    'Kendrick Lamar',
    'Gucci Mane',
    'Dr. Dre',
    'A$AP Rocky',
    'J. Cole',
    "Ol' Dirty B**tard",
    '2 Chainz'
  ].sort();

}
