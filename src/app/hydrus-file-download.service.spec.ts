import { TestBed } from '@angular/core/testing';

import { HydrusFileDownloadService } from './hydrus-file-download.service';

describe('HydrusFileDownloadService', () => {
  let service: HydrusFileDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusFileDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
