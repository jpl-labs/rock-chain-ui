import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavBarComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  searching = false;



  artistCtrl: FormControl;
  filteredArtists: any;

  artists = [
    'Emancipator',
    'Daft Punk',
    'Kyle Dixon & Michael Stein',
    'Nightmares On Wax',
    'Luis Fonsi & Daddy Yankee',
    'Tycho',
    'The xx',
    'Port Blue',
    'Don Omar',
    'Decco',
    'Alex Midi',
    'Daddy Yankee',
    'J-Kwon',
    'Yntendo & Sam F',
    'Alesso',
    'Russ',
    'Ice Cube',
    'The Notorious B.I.G.',
    'Cypress Hill',
    'Dr. Dre',
    '2Pac (Tupac)',
    'Juvenile',
    'Snoop Dogg',
    'Ginuwine',
    'Bone Thugs-N-Harmony',
    'Tag Team',
    'DMX',
    'Drake',
    'Kendrick Lamar',
    'Gucci Mane',
    'Dr. Dre',
    'A$AP Rocky',
    'J. Cole',
    "Ol' Dirty B**tard",
    '2 Chainz'
  ].sort();

  constructor() {
    this.artistCtrl = new FormControl();

    this.filteredArtists = this.artistCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterArtists(name));
  }

  filterArtists = (val: string) => val ? this.artists.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.artists;

  search = (searching) => {
    this.searching = searching;
  }

}
