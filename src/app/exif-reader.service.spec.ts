import { TestBed } from '@angular/core/testing';

import { ExifReaderService } from './exif-reader.service';

describe('ExifReaderService', () => {
  let service: ExifReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExifReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
