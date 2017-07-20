import { TestBed, inject } from '@angular/core/testing';

import { WagerService } from './wager.service';

describe('WagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WagerService]
    });
  });

  it('should be created', inject([WagerService], (service: WagerService) => {
    expect(service).toBeTruthy();
  }));
});
