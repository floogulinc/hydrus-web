import { TestBed } from '@angular/core/testing';

import { HydrusApiService } from './hydrus-api.service';

describe('HydrusApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HydrusApiService = TestBed.inject(HydrusApiService);
    expect(service).toBeTruthy();
  });
});
