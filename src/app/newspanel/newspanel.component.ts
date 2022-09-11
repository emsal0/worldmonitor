import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.less']
})
export class NewspanelComponent implements OnInit, OnChanges {

  @Input() country_data: any = {'title': 'unselected', 'id': 'xx'};
  articles: Array<{title: string, link: string, content: string}> = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void { 
      if(changes['country_data'].currentValue.id != 'xx') {
        let newId = changes['country_data'].currentValue.id;
        let news_observable = this.newsService.
            getArticles('https://rss.cbc.ca/lineup/canada.xml');
        news_observable.subscribe(arts => {
            console.log(arts);
            this.articles = arts;
        });
      }
  }
}
