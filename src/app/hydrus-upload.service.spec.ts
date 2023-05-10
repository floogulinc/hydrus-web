import { TestBed } from '@angular/core/testing';

import { HydrusUploadService } from './hydrus-upload.service';

describe('HydrusUploadService', () => {
  let service: HydrusUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
