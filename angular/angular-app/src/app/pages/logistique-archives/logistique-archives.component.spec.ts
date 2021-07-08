import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistiqueArchivesComponent } from './logistique-archives.component';

describe('LogistiqueArchivesComponent', () => {
  let component: LogistiqueArchivesComponent;
  let fixture: ComponentFixture<LogistiqueArchivesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogistiqueArchivesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogistiqueArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
