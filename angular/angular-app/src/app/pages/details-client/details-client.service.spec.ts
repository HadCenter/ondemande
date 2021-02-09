import { TestBed } from '@angular/core/testing';

import { DetailsClientService } from './details-client.service';

describe('DetailsClientService', () => {
  let service: DetailsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
