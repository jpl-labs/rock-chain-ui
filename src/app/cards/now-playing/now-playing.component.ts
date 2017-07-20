import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AudioSong } from '../../../models/PlayerStatus';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SongFeedbackComponent } from '../../dialogs/song-feedback';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-now-playing',
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})
export class NowPlayingComponent implements OnInit {

  @Input() song: AudioSong;
  @Output() onLike = new EventEmitter<AudioSong>();
  @Output() onDislike = new EventEmitter<AudioSong>();

  selectedOption: string;

  constructor(public dialog: MdDialog) {

  }

  openDialog() {
    const dialogRef = this.dialog.open(SongFeedbackComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
    });
  }

  ngOnInit() {
  }

  feedback(positive: boolean) {

    const dialogRef = this.dialog.open(SongFeedbackComponent, {
      data: {
        verb: positive ? 'cheers' : 'boo',
        song: this.song
      }
    });

    dialogRef
      .afterClosed()
      .filter(result => result === 'true')
      .map(() => positive ? this.onLike : this.onDislike)
      .subscribe(emitter => emitter.emit(this.song));
  }
}
