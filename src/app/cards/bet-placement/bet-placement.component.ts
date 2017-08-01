import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WagerService } from '../../services/wager.service';
import { BlockchainService } from '../../services/blockchain.service';
import { FormControl, FormsModule, NgForm, Validators  } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import { BetByRound } from '../../../models/Bet';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
const diacritics = require('diacritics');

@Component({
  selector: 'app-bet-placement',
  templateUrl: './bet-placement.component.html',
  styleUrls: ['./bet-placement.component.css']
})
export class BetPlacementComponent implements OnInit {
  @Output() onBet = new EventEmitter<BetByRound>();

  model = {
    password: '',
    artist: '',
    walletId: '',
    numberOfRounds: 0
  };

  betByRound: BetByRound;
  artistCtrl: FormControl;
  numberOfRoundsCtrl: FormControl;
  passwordCtrl: FormControl;
  wagerService: WagerService;
  blockchainService: BlockchainService;
  filteredArtists: any;
  numberOfRounds: number;
  snackBar: MdSnackBar;

  artists: string[];

  constructor(private _wagerService: WagerService,
    private _blockchainService: BlockchainService,
    private _snackBar: MdSnackBar) {
    this.wagerService = _wagerService;
    this.blockchainService = _blockchainService;
    this.snackBar = _snackBar;
    this.artistCtrl = new FormControl('', [<any>Validators.required]);
    this.numberOfRoundsCtrl = new FormControl('', [<any>Validators.required]);
    this.passwordCtrl = new FormControl('', [<any>Validators.required]);
    this.artists = this.wagerService.artists;
    this.filteredArtists = this.artistCtrl.valueChanges
      .startWith(this.artistCtrl.value)
      .map(name => this.filterArtists(name));
  }

  filterArtists = (val: string) => val ? this.artists.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.artists;

  ngOnInit() {
  }

  onSubmit = () => {
    if (!this.artistCtrl.valid ||
      !this.passwordCtrl.valid ||
      !this.numberOfRoundsCtrl.valid) {
        return;
    }

    //this.blockchainService.web3.personal.unlockAccount(localStorage.getItem('walletId'), this.passwordCtrl.value, 2);

    this.blockchainService.unlockAccount(localStorage.getItem('walletId'), this.passwordCtrl.value, 2)
      .subscribe(success => {
        if (success) {
          this.betByRound = {
            artist: diacritics.remove(this.artistCtrl.value).replace(/[^\w]/gi, '').toLowerCase(),
            password: this.passwordCtrl.value,
            walletId: '',
            numberOfRounds: this.numberOfRoundsCtrl.value
          };
          this.onBet.emit(this.betByRound);
        } else {
          this.snackBar.open('Unable to place bet - invalid password');
        }
        this.artistCtrl.reset();
        this.passwordCtrl.reset();
        this.numberOfRoundsCtrl.reset();
      }, error => {
        this.snackBar.open('Unable to place bet - invalid password');
      });
  }
}
