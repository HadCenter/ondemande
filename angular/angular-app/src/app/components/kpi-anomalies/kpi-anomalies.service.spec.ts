import { TestBed } from '@angular/core/testing';

import { KpiAnomaliesService } from './kpi-anomalies.service';

describe('KpiAnomaliesService', () => {
  let service: KpiAnomaliesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiAnomaliesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
