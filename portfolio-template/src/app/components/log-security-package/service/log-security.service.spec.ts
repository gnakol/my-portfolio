import { TestBed } from '@angular/core/testing';

import { LogSecurityService } from './log-security.service';

describe('LogSecurityService', () => {
  let service: LogSecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogSecurityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
