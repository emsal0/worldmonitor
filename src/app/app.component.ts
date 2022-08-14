import { Component } from '@angular/core';
import { WorldmapComponent } from './worldmap/worldmap.component';
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
  country_cursor:string;
  parser:any;

  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) { 

    this.country_cursor = "UNIMPLEMENTED";
    this.svg='<svg></svg>';
  }

  ngOnInit(): void {
    this.httpClient.get('assets/worldmap.svg', { responseType : 'text' })
      .subscribe(value => {
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
      });
  }
}
