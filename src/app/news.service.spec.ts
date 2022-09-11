import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { NewsService } from './news.service';


describe('NewsService', () => {

  let service: NewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule],
    });
    service = TestBed.inject(NewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should output something', () => {
      let f = service
          .getArticles('http://localhost:8000/' +
                       'feed?n=https://rss.cbc.ca/lineup/canada.xml'); 
      f.then(() => {});
  });
});
