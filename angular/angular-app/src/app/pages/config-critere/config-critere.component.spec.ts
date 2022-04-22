import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCritereComponent } from './config-critere.component';

describe('ConfigCritereComponent', () => {
  let component: ConfigCritereComponent;
  let fixture: ComponentFixture<ConfigCritereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigCritereComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCritereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
