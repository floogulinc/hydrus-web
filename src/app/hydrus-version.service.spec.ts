import { TestBed } from '@angular/core/testing';

import { HydrusVersionService } from './hydrus-version.service';

describe('HydrusVersionService', () => {
  let service: HydrusVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
