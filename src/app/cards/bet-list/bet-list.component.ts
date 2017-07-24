import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.css']
})
export class BetListComponent implements OnInit {

  @Output() onLike = new EventEmitter<AudioSong>();


  constructor() { }

  ngOnInit() {
  }

  placeBet = () => {

  }

}
