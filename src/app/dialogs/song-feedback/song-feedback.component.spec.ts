import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongFeedbackComponent } from './song-feedback.component';

describe('SongFeedbackComponent', () => {
  let component: SongFeedbackComponent;
  let fixture: ComponentFixture<SongFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
