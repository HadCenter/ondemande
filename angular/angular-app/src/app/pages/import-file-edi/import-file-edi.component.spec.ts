import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFileEdiComponent } from './import-file-edi.component';

describe('ImportFileEdiComponent', () => {
  let component: ImportFileEdiComponent;
  let fixture: ComponentFixture<ImportFileEdiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportFileEdiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportFileEdiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
