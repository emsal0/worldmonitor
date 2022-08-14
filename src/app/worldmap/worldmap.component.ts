import { Component, SimpleChanges, OnInit, OnChanges, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryComponent } from '../country/country.component';
import { HttpClient } from '@angular/common/http';

import { parse as svgParse } from 'svg-parser';

@Component({
  selector: 'app-worldmap',
  templateUrl: './worldmap.component.html',
  styleUrls: ['./worldmap.component.less']
})
export class WorldmapComponent implements OnInit {

  @Input() svg:SafeHtml = '';
  country_cursor:string = '';
  countries:Array<CountryComponent> = [];
  parser:any;

  constructor(
    private sanitizer: DomSanitizer,
    private httpClient: HttpClient,
  ) { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const svgString = changes['svg'].currentValue['changingThisBreaksApplicationSecurity'];
    console.log(svgParse(svgString).children[0]);
  }
}
