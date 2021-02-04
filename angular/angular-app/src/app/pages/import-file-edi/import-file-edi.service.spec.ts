import { TestBed } from '@angular/core/testing';

import { ImportFileEdiService } from './import-file-edi.service';

describe('ImportFileEdiService', () => {
  let service: ImportFileEdiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportFileEdiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
