import { TestBed } from '@angular/core/testing';

import { ListFileEdiService } from './list-file-edi.service';

describe('ListFileEdiService', () => {
  let service: ListFileEdiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListFileEdiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
