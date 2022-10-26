import { TestBed } from '@angular/core/testing';

import { fraisService } from './frais.service';

describe('fraisService', () => {
  let service: fraisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(fraisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
