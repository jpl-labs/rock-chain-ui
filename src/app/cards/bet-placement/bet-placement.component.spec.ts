import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetPlacementComponent } from './bet-placement.component';

describe('BetPlacementComponent', () => {
  let component: BetPlacementComponent;
  let fixture: ComponentFixture<BetPlacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetPlacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
