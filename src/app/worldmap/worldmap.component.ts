import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.less']
})
export class WorldmapComponent implements OnInit {

  svg:SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) { 

    this.svg='<svg></svg>';
  }

  ngOnInit(): void {
    this.httpClient.get('assets/worldmap.svg', { responseType : 'text' })
      .subscribe(value => {
        console.log("asdf");
        this.svg = this.sanitizer.bypassSecurityTrustHtml(value);
      });
  }

}
