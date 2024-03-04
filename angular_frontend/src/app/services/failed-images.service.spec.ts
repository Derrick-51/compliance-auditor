import { TestBed } from '@angular/core/testing';

import { FailedImagesService } from './failed-images.service';

describe('FailedImagesService', () => {
  let service: FailedImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
