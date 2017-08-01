import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/bindNodeCallback';

import * as Web3 from 'web3';

import { BigNumber } from 'bignumber.js';
import { providers, Transaction, AbstractBlock } from 'web3';

@Injectable()
export class BlockchainService {
  web3: Web3;
  nowPlaying: AudioSong;
  songChanged: EventEmitter<Transaction> = new EventEmitter();
  getBalanceAsObservable: (address: string) => Observable<BigNumber>;
  getAccountsAsObservable: () => Observable<string[]>;
  getBlockAsObservable: (v1: string | number) => Observable<AbstractBlock>;
  unlockAccountAsObservable: (v1: string, v2: string, v3: number) => Observable<boolean>;

  constructor() {
    this.web3 = new Web3(new providers.HttpProvider('http://tc20175xj.eastus.cloudapp.azure.com:8545'));

    this.getBalanceAsObservable = Observable.bindNodeCallback(this.web3.eth.getBalance);
    this.getAccountsAsObservable = Observable.bindNodeCallback(this.web3.eth.getAccounts);
    this.getBlockAsObservable = Observable.bindNodeCallback(this.web3.eth.getBlock);
    this.unlockAccountAsObservable = Observable.bindNodeCallback(this.web3.personal.unlockAccount);

    this.setupBlockchainFilters();
  }

  setupBlockchainFilters = () => {
    // Log the transaction hash of any new pending transaction on the blockchain
    this.web3.eth.filter('pending').watch((error, result: any) => {
      if (!error) {
        const tx = this.web3.eth.getTransaction(result);
        this.songChanged.emit(tx);
      }
    });
  }

  createNewGethAccount = (password: string): string => {
    return this.web3.personal.newAccount(password);
  }

  getSongChangedEmitter = () =>
    this.songChanged

  getAccountBalance = (walletId: string): Observable<number> =>
    this.getBalanceAsObservable(walletId).map((balance: BigNumber) => this.web3.fromWei(balance, 'ether').toNumber())

  getAccounts = (): Observable<string[]> =>
    this.getAccountsAsObservable()

  getGenesisAccount = () => {
    return '0x72e98c3c1be92b3195fa3a6dc62ca90e77e6f9be';
  }

  unlockAccount = (wallet: string, password: string, time: number): Observable<boolean> => {
    return this.unlockAccountAsObservable(wallet, password, time).map((success: boolean) => success);
  }
}
