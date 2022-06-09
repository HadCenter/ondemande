import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturationTransportComponent } from './facturation-transport.component';

describe('FacturationTransportComponent', () => {
  let component: FacturationTransportComponent;
  let fixture: ComponentFixture<FacturationTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturationTransportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturationTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
