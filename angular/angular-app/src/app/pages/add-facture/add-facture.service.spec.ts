import { TestBed } from '@angular/core/testing';

import { AddFactureService } from './add-facture.service';

describe('AddFactureService', () => {
  let service: AddFactureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFactureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
