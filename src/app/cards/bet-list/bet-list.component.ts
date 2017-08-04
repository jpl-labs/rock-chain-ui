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
        let loadedBets = JSON.parse(myBets).filter(bet => bet.endRound >= num.toNumber());
                          
        // sort by end round, ascending
        this.myBets = loadedBets.sort((b1, b2) => {
                            if (b1.endRound > b2.endRound) {
                              return 1;
                            }
                            if (b1.endRound < b2.endRound) {
                              return -1;
                            }
                            return 0;
                          });
      }
    });
  }
}
