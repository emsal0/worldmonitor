import { TestBed } from '@angular/core/testing';

import { FeedListService } from './feed-list.service';

describe('FeedListService', () => {
  let service: FeedListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
