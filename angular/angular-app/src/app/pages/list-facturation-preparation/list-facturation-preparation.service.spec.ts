import { TestBed } from '@angular/core/testing';

import { ListFacturationPreparationService } from './list-facturation-preparation.service';

describe('ListFacturationPreparationService', () => {
  let service: ListFacturationPreparationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListFacturationPreparationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
