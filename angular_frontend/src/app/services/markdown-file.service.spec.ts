import { TestBed } from '@angular/core/testing';

import { MarkdownFileService } from './markdown-file.service';

describe('MarkdownFileService', () => {
  let service: MarkdownFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
