import { TestBed } from '@angular/core/testing';

import { HydrusServicesService } from './hydrus-services.service';

describe('HydrusServicesService', () => {
  let service: HydrusServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
