import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NewsService } from '../news.service';

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.less']
})
export class NewspanelComponent implements OnInit, OnChanges {

  @Input() country_data: any = {'title': 'unselected', 'id': 'xx'};
  @Input() rss_list: { [id: string]: string } = {};
  articles: Array<{title: string, link: string, content: string}> = [];

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void { 
      console.log(changes);
      let country_change = changes['country_data'].currentValue as
        {id: string, title: string};
      if(changes['country_data'].currentValue.id != 'xx') {
        this.articles = [];
        let newId = country_change.id;
        console.log("newId: "+ newId);
        let news_observable = this.newsService.
            getArticles(this.rss_list[newId][0]);
        news_observable.subscribe(arts => {
            console.log(arts);
            this.articles = arts;
        });
      }
  }
}
