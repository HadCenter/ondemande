import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationLogistiqueComponent } from './facturation-logistique.component';

describe('FacturationLogistiqueComponent', () => {
  let component: FacturationLogistiqueComponent;
  let fixture: ComponentFixture<FacturationLogistiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturationLogistiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationLogistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
