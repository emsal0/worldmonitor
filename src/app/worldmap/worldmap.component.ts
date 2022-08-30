import { Component, SimpleChanges, ViewEncapsulation,
  OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryComponent } from '../country/country.component';
import { HttpClient } from '@angular/common/http';

import { matches as hMatches, select as hSelect,
  selectAll as hSelectAll } from 'hast-util-select';
import { HtmlParser } from '@starptech/webparser';
import { toHtml } from 'hast-util-to-html'

const fromWebparser = require('@starptech/hast-util-from-webparser');

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WorldmapComponent implements OnInit {

  @Input() svg: SafeHtml = '';
  @Output() broadcastCountryInfo = new EventEmitter<{id: string, title: string}>;
  country_cursor: string = '';
  countries: Array<any> = [];
  parser: HtmlParser = new HtmlParser({});

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

  clickCountry() {
    console.log('clicked!');
  }
}
