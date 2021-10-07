import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerbiEmbeddedComponent } from './powerbi-embedded.component';

describe('PowerbiEmbeddedComponent', () => {
  let component: PowerbiEmbeddedComponent;
  let fixture: ComponentFixture<PowerbiEmbeddedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerbiEmbeddedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerbiEmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
