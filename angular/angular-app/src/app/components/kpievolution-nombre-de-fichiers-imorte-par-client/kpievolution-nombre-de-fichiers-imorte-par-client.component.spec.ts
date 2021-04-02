import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KPIEvolutionNombreDeFichiersImorteParClientComponent } from './kpievolution-nombre-de-fichiers-imorte-par-client.component';

describe('KPIEvolutionNombreDeFichiersImorteParClientComponent', () => {
  let component: KPIEvolutionNombreDeFichiersImorteParClientComponent;
  let fixture: ComponentFixture<KPIEvolutionNombreDeFichiersImorteParClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KPIEvolutionNombreDeFichiersImorteParClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KPIEvolutionNombreDeFichiersImorteParClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
