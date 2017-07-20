import { Injectable, Inject, forwardRef } from '@angular/core';
import { environment } from '../../environments/environment';
import { AudioSong } from '../../models/PlayerStatus';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise.js';

const Web3 = require('web3');

@Injectable()
export class BlockchainService {
  web3: any;
  nowPlaying: AudioSong;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(environment.rpcEndpoint));
  }

  setupBlockchainFilters = () => {
    // Log the transaction hash of any new pending transaction on the blockchain
    this.web3.eth.filter('pending').watch((error, result) => {
      if (!error) {
        const tx = this.web3.eth.getTransaction(result);
        /*if (tx.to === this.wagerService.instance.address && tx.from === this.web3.eth.accounts[0]) {
          const jsonAscii = this.web3.toAscii(tx.input.match(new RegExp('7b22.+227d'))[0]);
          const songData = JSON.parse(jsonAscii);
          this.nowPlaying = songData;
        }*/
      }
    });

    // Log the object representing the most recently mined block on the blockchain
    this.web3.eth.filter('latest').watch((error, result) => {
      if (!error) {
        // TODO let's do some visual stuff with the current block
        console.log('block: ' + result);
      }
    });
  }

  getAccountBalance = (walletId: string): Observable<string> => {
    return Observable.fromPromise(
      this.web3.fromWei(
        this.web3.eth.getBalance(walletId).toNumber(), 'ether'));
  }
}
