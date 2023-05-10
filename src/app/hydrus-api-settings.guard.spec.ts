import { TestBed } from '@angular/core/testing';

import { HydrusApiSettingsGuard } from './hydrus-api-settings.guard';

describe('HydrusApiSettingsGuard', () => {
  let guard: HydrusApiSettingsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HydrusApiSettingsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
