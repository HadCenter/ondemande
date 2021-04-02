import { TestBed } from '@angular/core/testing';

import { KPInombreDeFichiersImorteParClientService } from './kpinombre-de-fichiers-imorte-par-client.service';

describe('KPInombreDeFichiersImorteParClientService', () => {
  let service: KPInombreDeFichiersImorteParClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KPInombreDeFichiersImorteParClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
