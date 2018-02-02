import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-song-feedback',
  templateUrl: './song-feedback.component.html',
  styleUrls: ['./song-feedback.component.css']
})
export class SongFeedbackComponent {

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<SongFeedbackComponent>
  ) { }

}
