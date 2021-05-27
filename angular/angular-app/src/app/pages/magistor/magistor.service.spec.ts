import { TestBed } from '@angular/core/testing';

import { MagistorService } from './magistor.service';

describe('MagistorService', () => {
  let service: MagistorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MagistorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
