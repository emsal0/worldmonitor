import { Component, SimpleChanges, ViewEncapsulation,
  OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { select as hSelect, selectAll as hSelectAll } from 'hast-util-select';
import { HtmlParser } from '@starptech/webparser';
import { toHtml } from 'hast-util-to-html'

const fromWebparser = require('@starptech/hast-util-from-webparser');

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WorldmapComponent implements OnInit, OnChanges {

  @Input() svg: SafeHtml = '';
  @Output() broadcastCountryInfo = new EventEmitter<{id: string, title: string}>;
  country_cursor: string = '';
  countries: Array<any> = [];
  parser: HtmlParser = new HtmlParser({});

  viewBoxCoords: Array<number> = [0, 0, 2754, 1398]
  ratio: number = 2754 / 1398;

  constructor(
    private sanitizer: DomSanitizer,
  ) { 
  }

  ngOnInit() {}

  countryEvent(event: any) {
    console.log(event);
    this.broadcastCountryInfo.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const svgString = changes['svg']
      .currentValue['changingThisBreaksApplicationSecurity'];
    let svgWebParse = this.parser.parse(svgString, '');
    let svgHast = fromWebparser(svgWebParse.rootNodes).children[1];
    
    let oceanData = hSelect('.oceanxx', svgHast);
    let countryData = hSelectAll(
      'path:not(.oceanxx):not(.limitxx):has(title),' +
        'g:not(.oceanxx):not(.limitxx):has(title)',
      svgHast
    );

    console.log(countryData);
    svgHast.children = [oceanData];
    this.countries = countryData;
    this.svg = this.sanitizer.bypassSecurityTrustHtml(toHtml(svgHast));

    /* TEMP */ 
    //console.log(this.countries.map(country => {
    //    let countryId = country.properties.id
    //    let titleTag = hSelect('title', country);
    //    let countryTitle = "NONE";
    //    if (titleTag != null) {
    //      countryTitle = (titleTag.children[0] as HTMLInputElement).value;
    //    }
    //    return { id: countryId, title: countryTitle };
    //}));
  }
  onWheel(event: any) {
    event.preventDefault()
    if (event.ctrlKey) {
      if(this.viewBoxCoords[3] + event.deltaY > 100) {
          console.log("Mouse Event:");
          console.log("event data: ");
          console.log(event);
          console.log("viewbox data: " + JSON.stringify(this.viewBoxCoords));
          let xdiff = event.clientX - this.viewBoxCoords[0]
          let dir_x = Math.sign(xdiff);
          let dir_y = Math.sign(event.clientY - this.viewBoxCoords[1]);
          this.viewBoxCoords[0] += dir_x * Math.abs(event.deltaY) * this.ratio;
          this.viewBoxCoords[1] += dir_y * Math.abs(event.deltaY);
          this.viewBoxCoords[2] += event.deltaY * this.ratio;
          this.viewBoxCoords[3] += event.deltaY;
      }
    }
  }

  clickCountry() {
    console.log('clicked!');
  }
}
