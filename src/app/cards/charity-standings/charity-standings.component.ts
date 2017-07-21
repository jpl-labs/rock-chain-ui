import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';
import { Charity } from '../../../models/Charity';

@Component({
  selector: 'app-charity-standings',
  templateUrl: './charity-standings.component.html',
  styleUrls: ['./charity-standings.component.css']
})
export class CharityStandingsComponent implements OnInit {
  blockchainService: BlockchainService;
  balances: Map<string, number>;

  charity1 : Charity; 
  charity2 : Charity; 
  charity3 : Charity; 
  charities: Charity[] = [];
  totalCharityAmount: number;
  
  constructor(private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;

    
    //test data 
      this.charity1 = {
      id: 1,
      name: "animals",
      amount: 100,
      backers: 5,
      icon: "pets"
    }  
    this.charities.push(this.charity1);

    this.charity2 = {
      id: 2,
      name: "kids",
      amount: 25,
      backers: 4,
      icon: "child_care"
    }   
    this.charities.push(this.charity2);

    this.charity3 = {
      id: 3,
      name: "disaster",
      amount: 50,
      backers: 7,
      icon: "warning"
    }  
    this.charities.push(this.charity3);

    this.charities.sort(function (a,b){
      return b.amount - a.amount;
    });

    this.totalCharityAmount = this.charities.reduce(function (sum, value){
      return sum + value.amount;
    }, 0);
   }

  ngOnInit() {
  }

}
