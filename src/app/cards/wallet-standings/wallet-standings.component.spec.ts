import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletStandingsComponent } from './wallet-standings.component';

describe('WalletStandingsComponent', () => {
  let component: WalletStandingsComponent;
  let fixture: ComponentFixture<WalletStandingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletStandingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
