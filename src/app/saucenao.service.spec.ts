import { TestBed } from '@angular/core/testing';

import { SaucenaoService } from './saucenao.service';

describe('SaucenaoService', () => {
  let service: SaucenaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaucenaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
