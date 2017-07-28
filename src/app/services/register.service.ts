import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Register } from 'tc2017-contract-artifacts';
import { BlockchainService } from './blockchain.service';
import { Registration } from '../../models/Registration';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';
import 'rxjs/add/operator/mergeMap.js';

const contract = require('truffle-contract');

@Injectable()
export class RegisterService {
  Register = contract(Register);
  blockchainService: BlockchainService;
  accountRegistered: EventEmitter<any> = new EventEmitter();

  constructor( @Inject(BlockchainService) _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
    this.Register.setProvider(this.blockchainService.web3.currentProvider);
    this.setupContractWatchers();
  }

  setupContractWatchers = () => {
    this.Register.deployed().then((instance) => {
      const registration = instance.Registration();

      registration.watch((error, result) => {
        if (!error) {
          this.accountRegistered.emit(result);
        }
      });
    });
  }

  getAccountRegisteredEmitter = () => {
    return this.accountRegistered;
  }

  getInstance = () => {
    this.Register.deployed().then((instance) => {
      return instance;
    });
  }

  registerAccount = (registration: Registration): void => {
    this.Register.deployed().then((instance) => {
      instance.register.sendTransaction(
        registration.wallet,
        registration.charity,
        {
          from: this.blockchainService.web3.eth.accounts[0],
          gas: 4712388
        }
      );
    });
  }

  getAccountsForCharity = (charity: number): Observable<string[]> =>
    Observable.fromPromise(this.Register.deployed())
      .mergeMap((instance: any) => Observable.fromPromise(instance.getAccountsByCharity(charity)))
}
