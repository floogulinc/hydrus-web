import { TestBed } from '@angular/core/testing';

import { HydrusRatingsService } from './hydrus-ratings.service';

describe('HydrusRatingsService', () => {
  let service: HydrusRatingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusRatingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
