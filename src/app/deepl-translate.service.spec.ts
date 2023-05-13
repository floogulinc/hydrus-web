import { TestBed } from '@angular/core/testing';

import { DeeplTranslateService } from './deepl-translate.service';

describe('DeeplTranslateService', () => {
  let service: DeeplTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeeplTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
