import { TestBed } from '@angular/core/testing';

import { FacturationLogistiqueService } from './facturation-logistique.service';

describe('FacturationLogistiqueService', () => {
  let service: FacturationLogistiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturationLogistiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
