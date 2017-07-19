import { Component, NgModule, OnInit } from '@angular/core';
import { MdButtonModule, MdListModule, MdIconModule, MdLineModule, MdCardModule, MdProgressBarModule } from '@angular/material';
import { FooterModule } from '../../shared/footer/footer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.scss']
})
export class Homepage {
}

@NgModule({
  imports: [MdButtonModule, MdListModule, MdIconModule, MdLineModule, MdCardModule, MdProgressBarModule, FooterModule, RouterModule],
  exports: [Homepage],
  declarations: [Homepage],
})
export class HomepageModule { }
