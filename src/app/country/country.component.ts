import { Component, Input, OnInit, 
  OnChanges, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { toHtml } from 'hast-util-to-html'

@Component({
  selector: '[svgCountry]',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.less']
})
export class CountryComponent implements OnInit {

  countryId: string = '';
  @Input() countryEltJson: any;

  innerSvg: SafeHtml = '';
  @Output() broadcastId = new EventEmitter<string>;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  clickCountry() {
    console.log(this.countryEltJson.properties.id + " clicked!");
    this.broadcastId.emit(this.countryId);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const countryEltHast = changes['countryEltJson']
      .currentValue;
    this.innerSvg = this.sanitizer.bypassSecurityTrustHtml(toHtml(countryEltHast));
    //console.log(this.innerSvg);
  }

}
