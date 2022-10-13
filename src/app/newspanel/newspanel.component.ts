import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewsService } from '../news.service';
import { Observable, Subscription } from 'rxjs';
import { CountryData } from '../country-data';

interface Article {
  feedSource: string;
  title: string;
  link: string;
  content: string;
};

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.less']
})
export class NewspanelComponent implements OnInit, OnChanges {


  @Input() country_data: CountryData = {'title': 'unselected', 'id': 'xx'};
  @Input() rss_list: { [id: string]: string[] } = {};
  articles: Array<Article> = [];
  feedCounter: number = 0;

  show: boolean = false;
  feedUrls: string[] = [];
  rssRequestSubscriptions: { [url: string]: Subscription } = {};
  numSourceInputs: number = 0;

  constructor(private newsService: NewsService) { }

  resetUI() {
    this.numSourceInputs = 0;
  }

  ngOnInit(): void {
  }

  getBaseUrl(link: string) {
    let url = new URL(link);
    return url.hostname;
  }

  getFirstLetter(link: string) {
    let baseUrl = this.getBaseUrl(link);
    let subdomains = baseUrl.split('.');
    if (subdomains.length < 2) {
      return '?';
    }
    return subdomains[subdomains.length - 2][0];
  }

  addSourceInput() {
    this.numSourceInputs += 1;
  }

  addSource() {

  }
  removeSource(url: string) {
    this.rssRequestSubscriptions[url].unsubscribe();
    this.articles = this.articles.filter(art => art.feedSource != url);
    delete this.rssRequestSubscriptions[url];
  }

  getFaviconUrl(link: string) {
    let baseUrl = this.getBaseUrl(link);
    if (baseUrl === '') {
      return 'ERR'
    }

    return 'https://' + baseUrl + '/favicon.ico';
  }

  constructArticle(feedUrl: string,
                   art: {title: string, link: string, content: string}) {
    let nextArticle: Article = {
      feedSource: feedUrl,
      title: art.title,
      link: art.link,
      content: art.content
    };
    return nextArticle;
  }

  interleaveFeed(feedUrl: string, arts: Array<{title: string, link: string, content: string}>) {
    let idx = 0;
    while (idx < this.articles.length) {
      idx += this.feedCounter;
      let nextArticleIncomplete = arts.shift();
      if (nextArticleIncomplete !== undefined) { 
        let nextArticle = this.constructArticle(feedUrl, nextArticleIncomplete);
        this.articles.splice(idx, 0, nextArticle);
      }
      idx += 1;
    }
    while (arts.length > 0) {
      let nextArticleIncomplete = arts.shift();
      if (nextArticleIncomplete !== undefined) { 
        let nextArticle = this.constructArticle(feedUrl, nextArticleIncomplete);
        this.articles.splice(idx, 0, nextArticle);
      }
    }
    this.feedCounter += 1;
  }

  ngOnChanges(changes: SimpleChanges): void { 
    console.log(changes);
    let country_change = changes['country_data'].currentValue as
    {id: string, title: string};
    if(changes['country_data'].currentValue.id != 'xx') {
      this.resetUI();
      for (let sub of Object.values(this.rssRequestSubscriptions)) {
        sub.unsubscribe();
      }
      this.rssRequestSubscriptions = {};
      this.feedCounter = 0;
      this.articles = [];
      let newId = country_change.id;
      console.log("newId: "+ newId);
      this.feedUrls = this.rss_list[newId];
      for (let feedUrl of this.rss_list[newId]) {
        let news_observable = this.newsService.
          getArticles(feedUrl);
        this.rssRequestSubscriptions[feedUrl] = news_observable.subscribe(
          arts => this.interleaveFeed(feedUrl, arts)); 
      }
    }
  }
}
