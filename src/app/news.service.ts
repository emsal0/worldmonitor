import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }

  async getArticles(feed: string) {
    let news_observable = this.http.get(feed);
    news_observable.subscribe({
      next(x) {
        console.log(x);
      },

      error(err) {
        console.error('error occurred: ' + JSON.stringify(err));
      }
    });
  }
}
