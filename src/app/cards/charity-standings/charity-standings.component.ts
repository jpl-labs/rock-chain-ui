import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/count';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { Charity } from '../../../models/Charity';
import { RegisterService } from '../../services/register.service';
import { Balance } from '../../../models/Balance';

@Component({
  selector: 'app-charity-standings',
  templateUrl: './charity-standings.component.html',
  styleUrls: ['./charity-standings.component.css']
})

export class CharityStandingsComponent implements OnInit, OnChanges {

  @Input() charities: Charity[];

  totalCharityAmount: number;


  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    this.totalCharityAmount =
      this.charities ?
        this.charities
          .map(charity => charity.amount)
          .reduce((a, b) => a + b)
        : 0;
  }

}
