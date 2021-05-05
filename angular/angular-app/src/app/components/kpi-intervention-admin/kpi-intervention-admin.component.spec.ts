import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiInterventionAdminComponent } from './kpi-intervention-admin.component';

describe('KpiInterventionAdminComponent', () => {
  let component: KpiInterventionAdminComponent;
  let fixture: ComponentFixture<KpiInterventionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiInterventionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiInterventionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
