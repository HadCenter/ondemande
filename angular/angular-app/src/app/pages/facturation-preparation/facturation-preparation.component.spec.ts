import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationPreparationComponent } from './facturation-preparation.component';

describe('FacturationPreparationComponent', () => {
  let component: FacturationPreparationComponent;
  let fixture: ComponentFixture<FacturationPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturationPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
