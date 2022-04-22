import { TestBed } from '@angular/core/testing';

import { ConfigJourFerieService } from './config-jour-ferie.service';

describe('ConfigJourFerieService', () => {
  let service: ConfigJourFerieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigJourFerieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
