import { TestBed } from '@angular/core/testing';

import { PhotoswipeService } from './photoswipe.service';

describe('PhotoswipeService', () => {
  let service: PhotoswipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoswipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
