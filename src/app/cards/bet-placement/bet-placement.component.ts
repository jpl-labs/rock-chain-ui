import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WagerService } from '../../services/wager.service';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { BetByRound } from '../../../models/Bet';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

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
  filteredArtists: any;
  numberOfRounds: number;

  artists: string[];

  constructor(private _wagerService: WagerService) {
    this.wagerService = _wagerService;
    this.artistCtrl = new FormControl();
    this.numberOfRoundsCtrl = new FormControl();
    this.passwordCtrl = new FormControl();
    this.artists = this.wagerService.artists;
    this.filteredArtists = this.artistCtrl.valueChanges
      .startWith(this.artistCtrl.value)
      .map(name => this.filterArtists(name));
  }

  filterArtists = (val: string) => val ? this.artists.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.artists;

  ngOnInit() {
  }

  onSubmit = () => {
    this.betByRound = {
      artist: this.artistCtrl.value,
      password: this.passwordCtrl.value,
      walletId: '',
      numberOfRounds: this.numberOfRoundsCtrl.value
    };
    this.onBet.emit(this.betByRound);
    this.artistCtrl.reset();
    this.passwordCtrl.reset();
    this.numberOfRoundsCtrl.reset();
  }


}
