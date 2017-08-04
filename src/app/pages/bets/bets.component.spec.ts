import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsComponent } from './bets.component';

describe('BetsComponent', () => {
  let component: BetsComponent;
  let fixture: ComponentFixture<BetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
