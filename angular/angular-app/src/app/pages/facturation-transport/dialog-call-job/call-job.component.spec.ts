import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallJobComponent } from './call-job.component';

describe('CallJobComponent', () => {
  let component: CallJobComponent;
  let fixture: ComponentFixture<CallJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
