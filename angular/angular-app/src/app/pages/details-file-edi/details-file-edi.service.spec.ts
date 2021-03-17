import { TestBed } from '@angular/core/testing';

import { DetailsFileEdiService } from './details-file-edi.service';

describe('DetailsClientService', () => {
  let service: DetailsFileEdiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsFileEdiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
