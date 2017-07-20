import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Registration } from '../../../models/Registration';
import {
  MdInputModule,
  MdDialog,
  MdDialogRef
} from '@angular/material';
const Web3 = require('web3');


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Output() onRegister = new EventEmitter<Registration>();

  model = {
    charity: -1,
    password: ""
  };

  charities = ['animals', 'kids', 'disaster'];

  waitingForRegistration = false;

  constructor(public dialog: MdDialog) { 

  }

  ngOnInit() {

  }

  onSubmit() {
    let dialogRef = this.dialog.open(RegistrationDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result === "CONFIRM") {
        this.onRegister.emit(this.model);
      }
    })
  }
}

@Component({
  selector: 'registration-dialog',
  templateUrl: 'registration-dialog.html',
})
export class RegistrationDialog {
  constructor(public dialogRef: MdDialogRef<RegistrationDialog>) {}
}
