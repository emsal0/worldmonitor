import { Injectable } from '@angular/core';
import { request } from 'https';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor() { }

  async getArticles(feed: string) {
    request(feed, {}, (res) => { 
        res.on('data', (d) => { 
            console.log(d); 
        });
    });
  }
}
