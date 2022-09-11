import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'worldmonitor';

  svg:SafeHtml;
  parser:any;
  country_data: {id: string, title: string} = {'id': 'xx', 'title': 'none'};

  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) { 
    this.svg='<svg></svg>';
  }

  ngOnInit(): void {
    this.httpClient.get('assets/worldmap.svg', { responseType : 'text' })
      .subscribe(value => {
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
      });
  }
  
  onCountryInfo(event: {id: string, title: string}) {
    this.country_data = event;
  }
}
