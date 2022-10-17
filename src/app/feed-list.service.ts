import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedListService {

  constructor(private httpClient: HttpClient) { }

  getFeedsFromAsset(country_id: string): Observable<Array<string>> {
    return this.httpClient.get('assets/news_list.json').pipe(map(
      (value: any) => {
        try { 
          value = value as {[id:string]: string};
          return value[country_id];
        } catch(err) {
          throw 'Error parsing rss list';
        }
      }));
  }

  getFeeds(country_id: string): Observable<Array<string>> {
    //let obj: { [id: string]: string[] } = {};
    if (Object.keys(localStorage).includes('feeds')) {
      try {
        let feeds = JSON.parse(localStorage['feeds']);
        if (Object.keys(feeds).includes(country_id)) {
          return new Observable((subscriber) => {
            subscriber.next(feeds[country_id]);
            subscriber.complete();
          });
        } else { 
          return this.getFeedsFromAsset(country_id);
        }
      } catch (err) { }
    } 
    return this.getFeedsFromAsset(country_id);
  }

  updateFeeds(country_id: string, feeds: string[]) {
    return new Observable((subscriber) => {
      let obj: { [id: string]: string[] } = {};
      if (Object.keys(localStorage).includes('feeds')) {
        try {
          obj = JSON.parse(localStorage['feeds']);
        } catch(err) { }
      }
      obj[country_id] = feeds;
      localStorage['feeds'] = JSON.stringify(obj);
      subscriber.next(feeds);
    });
  }

}
