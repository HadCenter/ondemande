import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetailsFacturationComponent } from './dialog-details-facturation.component';

describe('DialogDetailsFacturationComponent', () => {
  let component: DialogDetailsFacturationComponent;
  let fixture: ComponentFixture<DialogDetailsFacturationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetailsFacturationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetailsFacturationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
