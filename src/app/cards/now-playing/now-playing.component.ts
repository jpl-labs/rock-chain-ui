import { Component, OnInit, Input } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent implements OnInit {

  @Input() song: AudioSong;

  constructor() { }

  ngOnInit() {
  }

}
