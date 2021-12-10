import { TestBed } from '@angular/core/testing';

import { PrestationErroneeService } from './prestation-erronee.service';

describe('PrestationErroneeService', () => {
  let service: PrestationErroneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestationErroneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
