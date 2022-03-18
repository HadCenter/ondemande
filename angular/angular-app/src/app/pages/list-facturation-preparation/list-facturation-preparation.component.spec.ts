import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFacturationPreparationComponent } from './list-facturation-preparation.component';

describe('ListFacturationPreparationComponent', () => {
  let component: ListFacturationPreparationComponent;
  let fixture: ComponentFixture<ListFacturationPreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFacturationPreparationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFacturationPreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
