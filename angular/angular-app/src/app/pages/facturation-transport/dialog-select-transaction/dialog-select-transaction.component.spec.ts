import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectTransactionComponent } from './dialog-select-transaction.component';

describe('DialogSelectTransactionComponent', () => {
  let component: DialogSelectTransactionComponent;
  let fixture: ComponentFixture<DialogSelectTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSelectTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
