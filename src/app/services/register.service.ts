import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Register } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Registration } from '../../models/Registration';
import { AppComponent } from '../app.component';

const contract = require('truffle-contract');

@Injectable()
export class RegisterService {
  Register = contract(Register);
  blockchainService: BlockchainService;
  appComponent: AppComponent;
  instance: any;
  walletRegistered: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;

    this.Register.setProvider(this.blockchainService.web3.currentProvider);
    this.Register.deployed().then((instance) => {
      this.instance = instance;
    });
  }

  registerAccount = (registration: Registration) => {
    const wallet = this.blockchainService.web3.personal.newAccount(registration.password);

    this.Register.deployed().then((instance) => {
        instance.register.sendTransaction(
            wallet,
            registration.charity,
            {
                from: this.blockchainService.web3.eth.accounts[0],
                gas: 4712388
            }
        );
    });
    this.walletRegistered.emit(wallet);
  }

  getAccountsForCharity = (charity: number) => {
    this.Register.deployed().then((instance) => {
      instance.getAccountsByCharity.call(0).then((result) => {
        console.log(result);
      });
    });
  }
}
