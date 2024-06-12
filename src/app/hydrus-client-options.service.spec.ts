import { TestBed } from '@angular/core/testing';

import { HydrusClientOptionsService } from './hydrus-client-options.service';

describe('HydrusClientOptionsService', () => {
  let service: HydrusClientOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusClientOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
