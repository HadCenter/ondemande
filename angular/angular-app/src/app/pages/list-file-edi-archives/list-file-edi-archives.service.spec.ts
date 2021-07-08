import { TestBed } from '@angular/core/testing';

import { ListFileEdiArchivesService } from './list-file-edi-archives.service';

describe('ListFileEdiArchivesService', () => {
  let service: ListFileEdiArchivesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListFileEdiArchivesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
