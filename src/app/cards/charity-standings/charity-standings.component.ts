import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BlockchainService } from '../../services/blockchain.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/count';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/zip';
import { Charity } from '../../../models/Charity';
import { RegisterService } from '../../services/register.service';
import { Balance } from '../../../models/Balance';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-charity-standings',
  templateUrl: './charity-standings.component.html',
  styleUrls: ['./charity-standings.component.css']
})

export class CharityStandingsComponent implements OnInit, OnChanges {

  @Input() charities: Charity[];

  totalCharityAmount: number;


  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'eff',
      sanitizer.bypassSecurityTrustResourceUrl('eff.svg'));
    iconRegistry.addSvgIcon(
      'maw',
      sanitizer.bypassSecurityTrustResourceUrl('maw.svg'));
    iconRegistry.addSvgIcon(
      'hsi',
      sanitizer.bypassSecurityTrustResourceUrl('hsi.svg'));
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
