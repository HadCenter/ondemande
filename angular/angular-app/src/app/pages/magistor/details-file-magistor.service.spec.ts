import { TestBed } from '@angular/core/testing';

import { DetailsFileMagistorService } from './details-file-magistor.service';

describe('DetailsFileMagistorService', () => {
  let service: DetailsFileMagistorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsFileMagistorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
