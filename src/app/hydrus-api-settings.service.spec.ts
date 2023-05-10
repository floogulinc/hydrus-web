import { TestBed } from '@angular/core/testing';

import { HydrusApiSettingsService } from './hydrus-api-settings.service';

describe('HydrusApiSettingsService', () => {
  let service: HydrusApiSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusApiSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
