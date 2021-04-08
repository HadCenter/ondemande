import { TestBed } from '@angular/core/testing';

import { DetailsTransactionService } from './details-transaction.service';

describe('DetailsTransactionService', () => {
  let service: DetailsTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
