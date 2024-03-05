import { TestBed } from '@angular/core/testing';

import { ReadGuidelinesService } from './read-guidelines.service';

describe('ReadGuidelinesService', () => {
  let service: ReadGuidelinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadGuidelinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
