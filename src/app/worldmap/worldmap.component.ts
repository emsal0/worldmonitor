import { Component, SimpleChanges, ViewEncapsulation,
  OnInit, OnChanges, Input } from '@angular/core';
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
  country_cursor: string = '';
  countries: Array<CountryComponent> = [];
  parser: HtmlParser = new HtmlParser({});

  constructor(
    private sanitizer: DomSanitizer,
  ) { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const svgString = changes['svg']
      .currentValue['changingThisBreaksApplicationSecurity'];
    let svgWebParse = this.parser.parse(svgString, '');
    let svgHast = fromWebparser(svgWebParse.rootNodes).children[1];
    
    let oceanData = hSelect('.oceanxx', svgHast);
    console.log(oceanData);
    let countryData = hSelectAll(
      'svg > path:has(title):not(.oceanxx),' +
        'svg > g:has(title):not(.oceanxx)',
      svgHast
    );

    //console.log(countryData);
    //for (let countryElt of countryData) {
      //console.log(toHtml(countryElt));
    //}
    //svgHast.children = [oceanData];
    //console.log(toHtml(svgHast));
    //this.svg = this.sanitizer.bypassSecurityTrustHtml(toHtml(svgHast));
  }

  clickCountry() {
    console.log('clicked!');
  }
}
