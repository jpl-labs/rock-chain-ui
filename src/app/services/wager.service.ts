import { Injectable } from '@angular/core';
import { Wager } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';

const contract = require('truffle-contract');

@Injectable()
export class WagerService {
  Wager = contract(Wager);
  blockchainService: BlockchainService;
  instance: any;

  constructor(private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Wager.setProvider(this.blockchainService.web3.currentProvider);
    this.Wager.deployed().then((instance) => {
      this.instance = instance;
    });
  }
}
