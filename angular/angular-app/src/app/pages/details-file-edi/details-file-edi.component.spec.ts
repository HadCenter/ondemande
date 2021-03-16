import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFileEdiComponent } from './details-file-edi.component';

describe('DetailsFileEdiComponent', () => {
  let component: DetailsFileEdiComponent;
  let fixture: ComponentFixture<DetailsFileEdiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsFileEdiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFileEdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
