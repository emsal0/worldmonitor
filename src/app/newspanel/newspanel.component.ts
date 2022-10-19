import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NewsService } from '../news.service';
import { FeedListService } from '../feed-list.service';
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
  styleUrls: ['./newspanel.component.less'],
})
export class NewspanelComponent implements OnInit, OnChanges {


  @Input() country_data: CountryData = {'title': 'unselected', 'id': 'xx'};
  @Input() rss_list: { [id: string]: string[] } = {};
  articles: Array<Article> = [];

  show: boolean = false;
  feedUrls: string[] = [];
  rssRequestSubscriptions: { [url: string]: Subscription } = {};

  addSourceCounter: number = 0;
  addSourceInputs: Array<{ id: number, id_string: string }> = [];

  addSourceControl: FormControl = new FormControl('');
  parseInt(x: any) { return parseInt(x); }

  updateFeedsSubscription: Subscription = new Subscription();

  constructor(private newsService: NewsService,
              private feedListService: FeedListService) { }

  resetUI() {
    this.addSourceCounter = 0;
    this.addSourceInputs = [];
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
    this.addSourceCounter += 1;
    let elt_data = { id: this.addSourceCounter,
      id_string: 'add-source-'+this.addSourceCounter};
    this.addSourceInputs.push(elt_data);
  }

  addSource(event: { id: string, feedUrl: string }) {
    let id_string = event.id;
    let feedUrl = event.feedUrl;
    this.addSourceObservable(feedUrl);
    this.removeSourceInput(id_string);
    this.updateFeeds();
  }

  removeSourceInput(event: any) {
    let add_source_id = event;
    this.addSourceInputs = this.addSourceInputs.filter(
      x => x.id_string != add_source_id);
  }

  removeSource(url: string) {
    this.feedUrls = this.feedUrls.filter( s => s != url );
    this.rssRequestSubscriptions[url].unsubscribe();
    this.articles = this.articles.filter(art => art.feedSource != url);
    delete this.rssRequestSubscriptions[url];
    this.updateFeeds();
  }

  restoreDefaultSources() {
    let removeObsv = this.feedListService.
      removeLocalStorageSources(this.country_data.id);
    removeObsv.subscribe(() => {
      this.getFeedsFromService(this.country_data.id);
    });
  }

  updateFeeds() {
    this.updateFeedsSubscription.unsubscribe();
    if (this.country_data.id != 'xx') {
      this.updateFeedsSubscription = this.feedListService.updateFeeds(
        this.country_data.id,
        this.feedUrls).subscribe();
    }
  }

  getFaviconUrl(link: string) {
    let baseUrl = this.getBaseUrl(link);
    if (baseUrl === '') {
      return 'ERR'
    }

    return 'https://' + baseUrl + '/favicon.ico';
  }

  addSourceObservable(feedUrl: string) {
    feedUrl = feedUrl.trim();
    let news_observable = this.newsService.
      getArticles(feedUrl);
    this.rssRequestSubscriptions[feedUrl] = news_observable.subscribe(
      arts => this.interleaveFeed(feedUrl, arts)); 
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

  interleaveFeed(feedUrl: string, arts: Array<{title: string, link: string, 
                 content: string}>) {
    let idx = 0;
    let n = this.articles.length;
    while (idx < n) {
      idx += Object.keys(this.rssRequestSubscriptions).length - 1;
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
        this.articles.push(nextArticle);
      }
    }
  }

  getFeedsFromService(country_id: string) {
    for (let sub of Object.values(this.rssRequestSubscriptions)) {
      sub.unsubscribe();
    }
    this.rssRequestSubscriptions = {};
    this.articles = [];
    console.log("getting feeds from service: "+ country_id);
    this.feedListService.getFeeds(country_id).subscribe(
      feedList => {
        this.feedUrls = feedList;
        for (let feedUrl of feedList) {
          this.addSourceObservable(feedUrl);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void { 
    console.log(changes);
    let country_change = changes['country_data'].currentValue as CountryData;
    if(changes['country_data'].currentValue.id != 'xx') {
      this.resetUI();
      let newId = country_change.id;
      this.getFeedsFromService(newId);
    }
  }
}
