import { TestBed } from '@angular/core/testing';

import { PhotoswipeService } from './photoswipe.service';

describe('PhotoswipeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhotoswipeService = TestBed.inject(PhotoswipeService);
    expect(service).toBeTruthy();
  });
});
