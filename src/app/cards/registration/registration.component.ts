import { Component, OnInit, EventEmitter, Output } from '@angular/core';
const Web3 = require('web3');


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @Output() onRegister = new EventEmitter<string>();

  constructor() { 

  }

  ngOnInit() {

  }

  onSubmit() {
    
  }
}
