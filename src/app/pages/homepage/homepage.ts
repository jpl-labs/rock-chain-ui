import { Component, NgModule, OnInit } from '@angular/core';
import { MdButtonModule, MdListModule, MdIconModule, MdLineModule, MdCardModule, MdProgressBarModule } from '@angular/material';
import { FooterModule } from '../../shared/footer/footer';
import { RouterModule } from '@angular/router';

const Web3 = require('web3');
const contract = require('truffle-contract');

import { Wager, Register } from 'tc2017-contract-artifacts';
import { canBeNumber } from '../../../util/validation';
import * as Cookie from 'js-cookie';
import { RegistrationComponent } from '../../cards/registration/registration.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class HomepageComponent {
  Wager = contract(Wager);
  Register = contract(Register);

  // TODO add proper types these variables
  account: any;
  accounts: any;
  web3: any;

  balance: number;
  walletId: string;
  betArtist: string;
  pKey: string;

  nowPlayingTitle: string;
  nowPlayingArtist: string;
  nowPlayingImg: string;
  winningAccounts: string[];
  payout: number;
  recentBet: string;

  status: string;
  canBeNumber = canBeNumber;

  constructor() {

    this.checkAndInstantiateWeb3();
    Cookie.set('walletId', '0xe50c83d4d2136e2972c5b67a9544af403d192dd4');
    this.walletId = Cookie.get('walletId');
    this.setupContractEventWatchers();
    this.setupBlockchainFilters();
    this.refreshBalance();
    this.recentBet = "Waiting for bets...";
    this.nowPlayingTitle = "Waiting for song change block...";
    this.nowPlayingArtist = "Waiting for song change block...";

  }

  checkAndInstantiateWeb3 = () => {
    this.web3 = new Web3(new Web3.providers.HttpProvider("http://tc20175xj.eastus.cloudapp.azure.com:8545"));
    this.Wager.setProvider(this.web3.currentProvider);
    this.Register.setProvider(this.web3.currentProvider);
  }

  setupContractEventWatchers = () => {
    this.Wager.deployed().then((instance) => {
      // Watch for BetPlaced event firing from Wager contract
      let betPlaced = instance.BetPlaced();
      betPlaced.watch((error, result) => {
        if (!error) {
          console.log("from: " + result.args.from + "\n"
            + "artist: " + result.args.artist + "\n"
            + "totalPot: " + result.args.totalPot.toNumber());
          console.log(result);
          this.refreshBalance();

          this.recentBet = result.args.from
            + " just placed a bet on "
            + result.args.artist
            + ", bringing the total pot to "
            + this.web3.fromWei(result.args.totalPot, "ether")
            + " OmniCoin";

          console.log(this.recentBet);
        }
      });

      // Watch for RoundOver event firing from Wager contract
      const roundOver = instance.RoundOver();
      roundOver.watch((error, result) => {
        if (!error) {
          console.log("payout: " + result.args.payout.toNumber() + "\n"
            + "contractBalance: " + result.args.contractBalance.toNumber() + "\n"
            + "totalPot: " + result.args.totalPot.toNumber() + "\n");
          console.log(result.args.winners);
          console.log(result);

          this.winningAccounts = this.parseWinners(result.args.winners);
          this.payout = this.web3.fromWei(result.args.payout, "ether");

          const songData = JSON.parse(result.args.songData);
            this.nowPlayingTitle = songData.title;
            this.nowPlayingArtist = songData.artist;
            this.nowPlayingImg = songData.cover;
          this.refreshBalance();
        }
      });
    });

    this.Register.deployed().then((instance) => {
      const registration = instance.Registration();
      registration.watch((error, result) => {
        if (!error) {
          console.log(result);
        }
      });
    });
  }

  private parseWinners = (origList) => {
    return origList.filter((item, i, ar) => {
      return ar.indexOf(item) === i;
    });
  }

  setupBlockchainFilters = () => {
    // Log the transaction hash of any new pending transaction on the blockchain
    this.web3.eth.filter('pending').watch((error, result) => {
      if (!error) {
        this.Wager.deployed().then((instance) => {
          const tx = this.web3.eth.getTransaction(result);
          if (tx.to === instance.address && tx.from === this.web3.eth.accounts[0]) {
            const jsonAscii = this.web3.toAscii(tx.input.match(new RegExp("7b22.+227d"))[0]);
            const songData = JSON.parse(jsonAscii);
            this.nowPlayingTitle = songData.title;
            this.nowPlayingArtist = songData.artist;
            this.nowPlayingImg = songData.cover;
          }
        });

      }
    });

    // Log the object representing the most recently mined block on the blockchain
    this.web3.eth.filter('latest').watch((error, result) => {
      if (!error) {
        console.log("block: " + result);
      }
    });
  }

  placeBet = () => {
    this.Wager.deployed().then((instance) => {
      const artist = this.betArtist;
      const pKey = this.pKey;

      // Test code - not working with testrpc
      // TODO: check this against the "live" chain
      instance.roundNumber.call().then(result => {
        console.log(result.toNumber());
      });

      /*this.Register.deployed().then((instance) => {
        instance.getAccountsByCharity.call(0).then(result => {
          console.log(result);
        })
      })*/

      this.web3.personal.unlockAccount(this.walletId, pKey, 2);
      instance.bet.sendTransaction(
        this.web3.toHex(artist),
        {
          from: this.walletId,
          to: instance.address,
          value: this.web3.toWei(1, "ether"),
          gas: 4712388
        });
    })
      .then(() => {
        this.refreshBalance();
      });
  }

  endRound = () => {
    this.Wager.deployed().then((instance) => {
      instance.endRound.sendTransaction(
        this.web3.toHex("Bon Jovi"),
        this.web3.toHex("{ \"artist\": \"Bon Jovi\", \"song\": \"Livin' on a Prayer\" }"),
        {
          from: "0x72e98c3c1be92b3195fa3a6dc62ca90e77e6f9be",
          gas: 4712388
        }
      );
    })
      .then(() => {
        this.refreshBalance();
      });
  }

  registerAccount = () => {
    this.Register.deployed().then((instance) => {
      instance.register.sendTransaction(
        this.walletId,
        0,
        {
          from: this.web3.accounts[0],
          gas: 4712388
        }
      );
    });
  }

  refreshBalance = () => {
    this.balance = this.web3.fromWei(this.web3.eth.getBalance(this.walletId).toNumber(), "ether");
  }

  setStatus = (message) => {
    this.status = message;
  }
}
