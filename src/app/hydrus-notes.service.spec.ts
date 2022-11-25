import { TestBed } from '@angular/core/testing';

import { HydrusNotesService } from './hydrus-notes.service';

describe('HydrusNotesService', () => {
  let service: HydrusNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrusNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
