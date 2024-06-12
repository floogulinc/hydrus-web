import { TestBed } from '@angular/core/testing';

import { ThemeTagsService } from './theme-tags.service';

describe('ThemeTagsService', () => {
  let service: ThemeTagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeTagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
