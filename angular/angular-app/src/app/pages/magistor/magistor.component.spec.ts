import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MagistorComponent } from './magistor.component';

describe('MagistorComponent', () => {
  let component: MagistorComponent;
  let fixture: ComponentFixture<MagistorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagistorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
