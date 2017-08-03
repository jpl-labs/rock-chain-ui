import { Component, Input, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';
import { WagerService } from '../../services/wager.service';
import { MyBet } from '../../../models/Bet';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.css']
})
export class BetListComponent implements OnInit {

  @Output() onLike = new EventEmitter<AudioSong>();

  @Input() myBets: Array<MyBet>;

  wagerService: WagerService;
  displayedColumns = ['artist', 'startRound', 'endRound'];

  constructor( @Inject(WagerService) _wagerService: WagerService) {
    this.wagerService = _wagerService;
    this.myBets = new Array<MyBet>();
  }

  ngOnInit() {
    this.wagerService.getRoundNumber().subscribe(num => {
      const myBets = localStorage.getItem('myBets');
      if (myBets) {
        this.myBets = JSON.parse(myBets).filter(bet => bet.endRound >= num.toNumber());
      }
    });
  }
}
