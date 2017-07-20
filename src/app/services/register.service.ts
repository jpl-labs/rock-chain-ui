import { Injectable } from '@angular/core';
import { Register } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';

const contract = require('truffle-contract');

@Injectable()
export class RegisterService {
  Wager = contract(Register);
  blockchainService: BlockchainService;
  instance: any;

  constructor() { }

}
