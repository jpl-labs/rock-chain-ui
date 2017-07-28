import { Component, OnInit } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';
import { BlockchainService } from '../../services/blockchain.service';
import { WagerService } from '../../services/wager.service';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.css']
})
export class PlayingComponent implements OnInit {


  currentSong: AudioSong;

  constructor(private wagerService: WagerService, private blockchainService: BlockchainService) { }

  ngOnInit() {
    const songSub = this.blockchainService.getSongChangedEmitter()
      .filter(result => result.to === this.wagerService.instance.address
        && result.from === this.blockchainService.web3.eth.accounts[0])
      .subscribe(result => this.currentSong = this.parseSongHex(result.input));
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
