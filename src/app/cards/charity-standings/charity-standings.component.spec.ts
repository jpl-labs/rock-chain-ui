import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityStandingsComponent } from './charity-standings.component';

describe('CharityStandingsComponent', () => {
  let component: CharityStandingsComponent;
  let fixture: ComponentFixture<CharityStandingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityStandingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
