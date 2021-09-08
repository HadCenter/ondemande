import { TestBed } from '@angular/core/testing';

import { LogistiqueArchivesService } from './logistique-archives.service';

describe('LogistiqueArchivesService', () => {
  let service: LogistiqueArchivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogistiqueArchivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
