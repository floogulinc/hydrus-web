import { TestBed } from '@angular/core/testing';

import { HydrusUrlService } from './hydrus-url.service';

describe('HydrusAddService', () => {
  let service: HydrusUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
