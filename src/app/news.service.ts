import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  getArticles(feed: string): Observable<Array<{title: string,
                                                link: string,
                                                content:string}>> {
    console.log(feed);
    let news_observable = this.http.get('http://localhost:8000/feed?n=' + feed);
    return news_observable.pipe(
        map(x => x as Array<{title: string, link: string, content: string}>));
  }
}
