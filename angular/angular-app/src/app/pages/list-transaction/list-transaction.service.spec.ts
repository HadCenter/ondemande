import { TestBed } from '@angular/core/testing';

import { ListTransactionService } from './list-transaction.service';

describe('ListTransactionService', () => {
  let service: ListTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
