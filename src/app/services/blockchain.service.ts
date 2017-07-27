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
  blockMined: EventEmitter<AbstractBlock> = new EventEmitter();
  getBalanceAsObservable: (address: string) => Observable<BigNumber>;
  getAccountsAsObservable: () => Observable<string[]>;
  getBlockAsObservable: (v1: string | number) => Observable<AbstractBlock>;

  constructor() {
    this.web3 = new Web3(new providers.HttpProvider('http://tc20175xj.eastus.cloudapp.azure.com:8545'));

    this.getBalanceAsObservable = Observable.bindNodeCallback(this.web3.eth.getBalance);
    this.getAccountsAsObservable = Observable.bindNodeCallback(this.web3.eth.getAccounts);
    this.getBlockAsObservable = Observable.bindNodeCallback(this.web3.eth.getBlock);

    this.setupBlockchainFilters();
  }

  setupBlockchainFilters = () => {
    // Log the transaction hash of any new pending transaction on the blockchain
    this.web3.eth.filter('pending').watch((error, result: any) => {
      if (!error) {
        const tx = this.web3.eth.getTransaction(result);

        /*if (tx.to === this.instance.address && tx.from === this.web3.eth.accounts[0]) {
          const jsonAscii = this.web3.toAscii(tx.input.match(new RegExp('7b22.+227d'))[0]);
          const songData = JSON.parse(jsonAscii);
          this.nowPlaying = songData;
        }*/
        this.songChanged.emit(tx);
      }
    });

    // Log the object representing the most recently mined block on the blockchain
    this.web3.eth.filter('latest').watch((error, result: any) => {
      if (!error) {
        this.getBlockAsObservable(result)
          .subscribe((block) => this.blockMined.emit(block));
      }
    });
  }

  createNewGethAccount = (password: string): string => {
    return this.web3.personal.newAccount(password);
  }

  getSongChangedEmitter = () =>
    this.songChanged

  getBlockMinedEmitter = () =>
    this.blockMined

  getAccountBalance = (walletId: string): Observable<number> =>
    this.getBalanceAsObservable(walletId).map((balance: BigNumber) => this.web3.fromWei(balance, 'ether').toNumber())

  getAccounts = (): Observable<string[]> =>
    this.getAccountsAsObservable()
}
