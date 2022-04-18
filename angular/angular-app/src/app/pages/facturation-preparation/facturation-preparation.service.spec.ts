import { TestBed } from '@angular/core/testing';

import { FacturationPreparationService } from './facturation-preparation.service';

describe('FacturationPreparationService', () => {
  let service: FacturationPreparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturationPreparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
