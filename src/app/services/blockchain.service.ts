import { Injectable, Inject, EventEmitter, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent.js';

const Web3 = require('web3');

@Injectable()
export class BlockchainService implements OnInit {
  web3: any;
  nowPlaying: AudioSong;
  songChanged: EventEmitter<any> = new EventEmitter();
  blockMined: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://tc20175xj.eastus.cloudapp.azure.com:8545'));
    this.setupBlockchainFilters();
  }

  ngOnInit() {

  }

  setupBlockchainFilters = () => {
    // Log the transaction hash of any new pending transaction on the blockchain
    this.web3.eth.filter('pending').watch((error, result) => {
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
    this.web3.eth.filter('latest').watch((error, result) => {
      if (!error) {
        const block = this.web3.eth.getBlock(result);
        this.blockMined.emit(block);
      }
    });
  }

  createNewGethAccount = (password: string): string => {
    return this.web3.personal.newAccount(password);
  }

  getSongChangedEmitter = () => {
    return this.songChanged;
  }

  getBlockMinedEmitter = () => {
    return this.blockMined;
  }

  getAccountBalance = (walletId: string): number => {
    return this.web3.fromWei(this.web3.eth.getBalance(walletId).toNumber(), 'ether');
  }

  getAccounts = (): string[] => {
    return this.web3.eth.accounts;
  }
}
