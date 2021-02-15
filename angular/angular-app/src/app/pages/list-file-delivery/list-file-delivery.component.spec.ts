import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileDeliveryComponent } from './list-file-delivery.component';

describe('ListFileDeliveryComponent', () => {
  let component: ListFileDeliveryComponent;
  let fixture: ComponentFixture<ListFileDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFileDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFileDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
