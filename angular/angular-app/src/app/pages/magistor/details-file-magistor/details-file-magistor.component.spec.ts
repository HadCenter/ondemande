import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsFileMagistorComponent } from './details-file-magistor.component';

describe('DetailsFileMagistorComponent', () => {
  let component: DetailsFileMagistorComponent;
  let fixture: ComponentFixture<DetailsFileMagistorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsFileMagistorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsFileMagistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
