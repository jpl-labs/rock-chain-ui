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

    this.subscriptions.push(this.wagerService.getLastSong()
      .subscribe(result => {
        const jsonAscii = this.blockchainService.web3.toAscii(result.match(new RegExp('7b22.+227d'))[0]);
        const songData = JSON.parse(jsonAscii);
        this.currentSong = songData;
      }));

    this.subscriptions.push(this.blockchainService.getSongChangedEmitter()
      .filter(result => result.to === this.wagerService.instance.address
        && result.from === this.blockchainService.web3.eth.accounts[0])
      .subscribe(result => this.currentSong = this.parseSongHex(result.input)));
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  parseSongHex = (hexString: string): AudioSong => {
    const jsonAscii = this.blockchainService.web3.toAscii(hexString.match(new RegExp('7b22.+227d'))[0]);
    return JSON.parse(jsonAscii);
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
