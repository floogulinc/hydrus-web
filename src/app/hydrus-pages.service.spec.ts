import { TestBed } from '@angular/core/testing';

import { HydrusPagesService } from './hydrus-pages.service';

describe('HydrusPagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HydrusPagesService = TestBed.get(HydrusPagesService);
    expect(service).toBeTruthy();
  });
});
