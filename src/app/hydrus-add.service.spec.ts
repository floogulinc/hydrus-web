import { TestBed } from '@angular/core/testing';

import { HydrusAddService } from './hydrus-add.service';

describe('HydrusAddService', () => {
  let service: HydrusAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
