import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileEDIComponent } from './list-file-edi.component';

describe('ListFileEDIComponent', () => {
  let component: ListFileEDIComponent;
  let fixture: ComponentFixture<ListFileEDIComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFileEDIComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFileEDIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
