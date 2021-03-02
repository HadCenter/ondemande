import { TestBed } from '@angular/core/testing';

import { DetailsUserService } from './details-user.service';

describe('DetailsUserService', () => {
  let service: DetailsUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
