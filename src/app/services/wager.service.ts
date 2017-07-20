import { Injectable, Inject } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Bet } from '../../models/Bet';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';
import * as Cookie from 'js-cookie';

const contract = require('truffle-contract');

@Injectable()
export class WagerService {
  Wager = contract(Wager);
  blockchainService: BlockchainService;
  instance: any;

  constructor(@Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.Wager.deployed().then((instance) => {
      this.instance = instance;
    });
  }

  placeBet = (bet: Bet): Observable<any> => {
    return Observable.fromPromise(this.Wager.deployed().then((instance) => {
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
    }));
  }
}
