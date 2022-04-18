import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigJourFerieComponent } from './config-jour-ferie.component';

describe('ConfigJourFerieComponent', () => {
  let component: ConfigJourFerieComponent;
  let fixture: ComponentFixture<ConfigJourFerieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigJourFerieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigJourFerieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
