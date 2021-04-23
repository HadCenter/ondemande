import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiAnomaliesComponent } from './kpi-anomalies.component';

describe('KpiAnomaliesComponent', () => {
  let component: KpiAnomaliesComponent;
  let fixture: ComponentFixture<KpiAnomaliesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiAnomaliesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiAnomaliesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
