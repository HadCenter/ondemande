import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestationErroneeComponent } from './prestation-erronee.component';

describe('PrestationErroneeComponent', () => {
  let component: PrestationErroneeComponent;
  let fixture: ComponentFixture<PrestationErroneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestationErroneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestationErroneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
