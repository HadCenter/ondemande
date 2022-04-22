import { TestBed } from '@angular/core/testing';

import { ConfigCritereService } from './config-critere.service';

describe('ConfigCritereService', () => {
  let service: ConfigCritereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigCritereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
