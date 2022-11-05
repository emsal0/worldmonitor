import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Article } from './article';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getArticles(feed: string): Observable<Array<Article>> {
    //console.log(feed);
    let news_observable = this.http.get('http://localhost:8080/feed?n=' +
                                        encodeURIComponent(feed));
    return news_observable.pipe(
        map(x => x as Array<Article>));
  }
}
