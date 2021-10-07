import { TestBed } from '@angular/core/testing';

import { PowerbiEmbeddedService } from './powerbi-embedded.service';

describe('PowerbiEmbeddedService', () => {
  let service: PowerbiEmbeddedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PowerbiEmbeddedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
