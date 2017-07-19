import {Component, EventEmitter, NgModule, Output} from '@angular/core';
import {MdButtonModule, MdToolbarModule, MdIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavBar {
    @Output() toggleSidenav = new EventEmitter<void>();

}

@NgModule({
  imports: [MdButtonModule, MdToolbarModule, MdIconModule, RouterModule],
  exports: [NavBar],
  declarations: [NavBar],
})
export class NavBarModule {}
