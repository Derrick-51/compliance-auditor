import { TestBed } from '@angular/core/testing';

import { SaveGuidelinesService } from './save-guidelines.service';

describe('SaveGuidelinesService', () => {
  let service: SaveGuidelinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveGuidelinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
