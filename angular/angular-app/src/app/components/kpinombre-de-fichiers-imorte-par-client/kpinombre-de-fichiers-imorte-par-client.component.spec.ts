import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KPInombreDeFichiersImorteParClientComponent } from './kpinombre-de-fichiers-imorte-par-client.component';

describe('KPInombreDeFichiersImorteParClientComponent', () => {
  let component: KPInombreDeFichiersImorteParClientComponent;
  let fixture: ComponentFixture<KPInombreDeFichiersImorteParClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KPInombreDeFichiersImorteParClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPInombreDeFichiersImorteParClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
