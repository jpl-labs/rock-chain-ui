import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Bet } from '../../models/Bet';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';
import * as Cookie from 'js-cookie';

const contract = require('truffle-contract');

@Injectable()
export class WagerService implements OnInit {
  Wager = contract(Wager);
  blockchainService: BlockchainService;
  betPlaced: EventEmitter<any> = new EventEmitter();
  roundOver: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
  }

  ngOnInit = () => {
    this.setupContractWatchers();
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
      return instance;
    });
  }

  placeBet = (bet: Bet)  => {
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
}