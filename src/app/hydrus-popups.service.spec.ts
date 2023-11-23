import { TestBed } from '@angular/core/testing';

import { HydrusPopupsService } from './hydrus-popups.service';

describe('HydrusPopupsService', () => {
  let service: HydrusPopupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusPopupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
