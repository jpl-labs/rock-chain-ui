import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../../services/blockchain.service';

@Component({
  selector: 'app-charity-standings',
  templateUrl: './charity-standings.component.html',
  styleUrls: ['./charity-standings.component.css']
})
export class CharityStandingsComponent implements OnInit {
  blockchainService: BlockchainService;
  balances: Map<string, number>;

  constructor(private _blockchainService: BlockchainService) {
    this.blockchainService = _blockchainService;
  }

  ngOnInit() {

  }
}
