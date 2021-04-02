import { TestBed } from '@angular/core/testing';

import { KPIEvolutionNombreDeFichiersImorteParClientService } from './kpievolution-nombre-de-fichiers-imorte-par-client.service';

describe('KPIEvolutionNombreDeFichiersImorteParClientService', () => {
  let service: KPIEvolutionNombreDeFichiersImorteParClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KPIEvolutionNombreDeFichiersImorteParClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
