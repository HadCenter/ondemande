import { TestBed } from '@angular/core/testing';

import { KpiInterventionAdminService } from './kpi-intervention-admin.service';

describe('KpiInterventionAdminService', () => {
  let service: KpiInterventionAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KpiInterventionAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
