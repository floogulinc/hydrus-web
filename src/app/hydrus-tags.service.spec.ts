import { TestBed } from '@angular/core/testing';

import { HydrusTagsService } from './hydrus-tags.service';

describe('HydrusTagsService', () => {
  let service: HydrusTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
