import { TestBed } from '@angular/core/testing';

import { PageinatorIntlService } from './pageinator-intl.service';

describe('PageinatorIntlService', () => {
  let service: PageinatorIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageinatorIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
