import { Component, OnInit, OnDestroy } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';
import { BlockchainService } from '../../services/blockchain.service';
import { WagerService } from '../../services/wager.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.css']
})
export class PlayingComponent implements OnInit, OnDestroy {

  currentSong: AudioSong;

  private subscriptions: Array<Subscription> = [];

  constructor(private wagerService: WagerService, private blockchainService: BlockchainService) { }

  ngOnInit() {

  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  like = (song: AudioSong) => {
    console.log('liked');
    console.log(song);
  }

  dislike = (song: AudioSong) => {
    console.log('disliked');
    console.log(song);
  }

}
