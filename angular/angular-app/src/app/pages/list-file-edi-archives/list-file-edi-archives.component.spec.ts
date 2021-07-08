import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFileEdiArchivesComponent } from './list-file-edi-archives.component';

describe('ListFileEdiArchivesComponent', () => {
  let component: ListFileEdiArchivesComponent;
  let fixture: ComponentFixture<ListFileEdiArchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFileEdiArchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFileEdiArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
