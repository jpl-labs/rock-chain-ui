import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Registration } from '../../../models/Registration';
import { CharityService } from '../../services/charity.service';
import {
  MatInputModule,
  MatDialog,
  MatDialogRef,
  MatSnackBar
} from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Output() onRegister = new EventEmitter<Registration>();
  charityService: CharityService;

  snackBar: MatSnackBar;

  model = {
    wallet: '',
    password: '',
    password2: '',
    charity: -1
  };

charities: string[];

  waitingForRegistration = false;

  constructor(public dialog: MatDialog,
              private _charityService: CharityService,
              private _snackBar: MatSnackBar) {
    this.charityService = _charityService;
    this.snackBar = _snackBar;
  }

  ngOnInit() {
    this.charities = this.charityService.charityNames;
  }

  onSubmit = () => {
    if (this.model.password === this.model.password2) {
      const dialogRef = this.dialog.open(RegistrationDialogComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'CONFIRM') {
          this.onRegister.emit(this.model);
          localStorage.setItem('charity', JSON.stringify(this.model.charity));
        }
      });
    } else {
      const snackBarRef = this.snackBar.open('Passwords do not match!', '', {
        duration: 5000
      });
    }
  }
}

@Component({
  selector: 'app-registration-dialog',
  templateUrl: 'registration-dialog.html',
})
export class RegistrationDialogComponent {
  constructor(public dialogRef: MatDialogRef<RegistrationDialogComponent>) {}
}
