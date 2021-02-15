import { TestBed } from '@angular/core/testing';

import { ListFileDeliveryService } from './list-file-delivery.service';

describe('ListFileDeliveryService', () => {
  let service: ListFileDeliveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListFileDeliveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
