import { TestBed } from '@angular/core/testing';

import { KPIService } from './KPI.service';

describe('HomeService', () => {
  let service: KPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
