import { TestBed } from '@angular/core/testing';

import { DashoardService } from './dashoard.service';

describe('DashoardService', () => {
  let service: DashoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
