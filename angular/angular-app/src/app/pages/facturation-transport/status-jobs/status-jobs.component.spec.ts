import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusJobsComponent } from './status-jobs.component';

describe('StatusJobsComponent', () => {
  let component: StatusJobsComponent;
  let fixture: ComponentFixture<StatusJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
