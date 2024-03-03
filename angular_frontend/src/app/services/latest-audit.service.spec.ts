import { TestBed } from '@angular/core/testing';

import { LatestAuditService } from './latest-audit.service';

describe('LatestAuditService', () => {
  let service: LatestAuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LatestAuditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
