import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsKpiPowerbiComponent } from './details-kpi-powerbi.component';

describe('DetailsKpiPowerbiComponent', () => {
  let component: DetailsKpiPowerbiComponent;
  let fixture: ComponentFixture<DetailsKpiPowerbiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsKpiPowerbiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsKpiPowerbiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
