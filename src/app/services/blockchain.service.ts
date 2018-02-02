import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/bindNodeCallback';

import * as Web3 from 'web3';
import * as BigNumber from 'bignumber.js';

import { providers, Transaction, AbstractBlock, SolidityEvent } from 'web3';

@Injectable()
export class BlockchainService {
  web3: Web3;
  nowPlaying: AudioSong;
  getBalanceAsObservable: (address: string) => Observable<BigNumber.BigNumber>;
  getAccountsAsObservable: () => Observable<string[]>;
  getBlockAsObservable: (v1: string | number) => Observable<AbstractBlock>;
  unlockAccountAsObservable: (v1: string, v2: string, v3: number) => Observable<boolean>;
  getTransactionAsObservable: (v1: string) => Observable<Transaction>;

  genesisAccount = '0x739a3e05eeea4d0b9cd000d52879669d8a0a93ad';

  private pendingTransactionSource = new Subject<Transaction>();

  pendingTransaction$ = this.pendingTransactionSource.asObservable();

  constructor() {
    this.web3 = new Web3(new providers.HttpProvider('http://rockppdcf.eastus.cloudapp.azure.com:8545'));

    this.getBalanceAsObservable = Observable.bindNodeCallback(this.web3.eth.getBalance as (x: string) => BigNumber.BigNumber);
    this.getAccountsAsObservable = Observable.bindNodeCallback(this.web3.eth.getAccounts);
    this.getBlockAsObservable = Observable.bindNodeCallback(this.web3.eth.getBlock);
    this.unlockAccountAsObservable = Observable.bindNodeCallback(this.web3.personal.unlockAccount);
    this.getTransactionAsObservable = Observable.bindNodeCallback(this.web3.eth.getTransaction);

    // const pendingFilter = this.web3.eth.filter('pending');

    /*
    const pendingFilterWatchAsObservable = Observable.bindNodeCallback<string>(this.web3.eth.filter('pending').watch);

    this.pendingTransaction$ =  pendingFilterWatchAsObservable()
      .mergeMap((transactionHash: string): Observable<Transaction> => this.getTransactionAsObservable(transactionHash));
    */

    this.web3.eth.filter('pending').watch((error, transactionHash: any) => {
      if (!error) {
        this.web3.eth.getTransaction(transactionHash, (err: Error, transaction: Transaction) => {
          this.pendingTransactionSource.next(transaction);
        });
      }
    });
  }

  createNewGethAccount = (password: string): string =>
    this.web3.personal.newAccount(password)

  getAccountBalance = (walletId: string): Observable<number> =>
    this.getBalanceAsObservable(walletId).map((balance: BigNumber.BigNumber) => this.web3.fromWei(balance, 'ether').toNumber())

  getAccounts = (): Observable<string[]> =>
    this.getAccountsAsObservable()

  unlockAccount = (wallet: string, password: string, time: number): Observable<boolean> =>
    this.unlockAccountAsObservable(wallet, password, time).map((success: boolean) => success)
}
