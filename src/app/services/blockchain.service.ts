import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/bindNodeCallback';

import * as Web3 from 'web3';

import { BigNumber } from 'bignumber.js';
import { providers, Transaction, AbstractBlock, SolidityEvent } from 'web3';

@Injectable()
export class BlockchainService {
  web3: Web3;
  nowPlaying: AudioSong;
  getBalanceAsObservable: (address: string) => Observable<BigNumber>;
  getAccountsAsObservable: () => Observable<string[]>;
  getBlockAsObservable: (v1: string | number) => Observable<AbstractBlock>;
  unlockAccountAsObservable: (v1: string, v2: string, v3: number) => Observable<boolean>;
  getTransactionAsObservable: (v1: string) => Observable<Transaction>;

  genesisAccount = '0x72e98c3c1be92b3195fa3a6dc62ca90e77e6f9be';

  private pendingTransactionSource = new Subject<Transaction>();

  pendingTransaction$ = this.pendingTransactionSource.asObservable();

  constructor() {
    this.web3 = new Web3(new providers.HttpProvider('http://tc20175xj.eastus.cloudapp.azure.com:8545'));

    this.getBalanceAsObservable = Observable.bindNodeCallback(this.web3.eth.getBalance);
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
    this.getBalanceAsObservable(walletId).map((balance: BigNumber) => this.web3.fromWei(balance, 'ether').toNumber())

  getAccounts = (): Observable<string[]> =>
    this.getAccountsAsObservable()

  unlockAccount = (wallet: string, password: string, time: number): Observable<boolean> =>
    this.unlockAccountAsObservable(wallet, password, time).map((success: boolean) => success)
}
