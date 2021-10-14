import { TestBed } from '@angular/core/testing';

import { DetailsKpiPowerbiService } from './details-kpi-powerbi.service';

describe('DetailsKpiPowerbiService', () => {
  let service: DetailsKpiPowerbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsKpiPowerbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
