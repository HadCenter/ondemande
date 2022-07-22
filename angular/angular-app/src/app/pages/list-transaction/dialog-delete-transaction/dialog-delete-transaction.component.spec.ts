import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteTransactionComponent } from './dialog-delete-transaction.component';

describe('DialogDeleteTransactionComponent', () => {
  let component: DialogDeleteTransactionComponent;
  let fixture: ComponentFixture<DialogDeleteTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDeleteTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
