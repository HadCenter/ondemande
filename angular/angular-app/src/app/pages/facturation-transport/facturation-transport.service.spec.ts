import { TestBed } from '@angular/core/testing';

import { FacturationTransportService } from './facturation-transport.service';

describe('FacturationTransportService', () => {
  let service: FacturationTransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturationTransportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
