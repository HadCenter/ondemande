import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { fraisComponent } from './frais.component';

describe('fraisComponent', () => {
  let component: fraisComponent;
  let fixture: ComponentFixture<fraisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ fraisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(fraisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
