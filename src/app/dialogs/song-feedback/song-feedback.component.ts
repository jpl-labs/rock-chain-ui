import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';


@Component({
  selector: 'app-song-feedback',
  templateUrl: './song-feedback.component.html',
  styleUrls: ['./song-feedback.component.css']
})
export class SongFeedbackComponent {

  constructor(
    @Optional() @Inject(MD_DIALOG_DATA) public dialogData: any,
    private dialogRef: MdDialogRef<SongFeedbackComponent>
  ) { }

}
