import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewsService } from '../news.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.less']
})
export class NewspanelComponent implements OnInit, OnChanges {

  @Input() country_data: any = {'title': 'unselected', 'id': 'xx'};
  @Input() rss_list: { [id: string]: string } = {};
  articles: Array<{title: string, link: string, content: string}> = [];
  feedCounter: number = 0;
  rssRequestSubscriptions: Array<Subscription> = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
  }

  getBaseUrl(link: string) {
      const re = /https:\/\/.*\.((.(?!\/))+)\.\w+\//;
      const re2 = /https:\/\/.*\.?((.(?!\/))+)\.\w+\//;
      let to_try = [re, re2];
      for (let r_exp of to_try) {
          let matches = link.match(r_exp);
          if (matches !== null) {
            console.log(matches);
            return [matches[0], matches[1]];
          }
      }
      return ['', '?'];
  }


  getFaviconUrl(link: string) {
      let baseUrl = this.getBaseUrl(link)[0];
      if (baseUrl === '') {
        return 'ERR'
      }

      return baseUrl + 'favicon.ico';
  }

  interleaveFeed(arts: Array<{title: string, link: string, content: string}>) {
      let idx = 0;
      while (idx < this.articles.length) {
          idx += this.feedCounter;
          let nextArticle = arts.shift();
          if (nextArticle !== undefined) { 
              this.articles.splice(idx, 0, nextArticle);
          }
          idx += 1;
      }
      while (arts.length > 0) {
          let nextArticle = arts.shift();
          if (nextArticle !== undefined) { 
              this.articles.push(nextArticle);
          }
      }
      this.feedCounter += 1;
  }

  ngOnChanges(changes: SimpleChanges): void { 
      console.log(changes);
      let country_change = changes['country_data'].currentValue as
        {id: string, title: string};
      if(changes['country_data'].currentValue.id != 'xx') {
        for (let sub of this.rssRequestSubscriptions) {
            sub.unsubscribe();
        }
        this.feedCounter = 0;
        this.articles = [];
        let newId = country_change.id;
        console.log("newId: "+ newId);
        for (let feedUrl of this.rss_list[newId]) {
            let news_observable = this.newsService.
                getArticles(feedUrl);
            this.rssRequestSubscriptions.push(news_observable.subscribe(
                arts => this.interleaveFeed(arts))); 
        }
      }
  }
}
