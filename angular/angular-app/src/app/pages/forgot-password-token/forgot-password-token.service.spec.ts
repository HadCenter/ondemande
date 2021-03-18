import { TestBed } from '@angular/core/testing';

import { ForgotPasswordTokenService } from './forgot-password-token.service';

describe('ForgotPasswordTokenService', () => {
  let service: ForgotPasswordTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForgotPasswordTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
