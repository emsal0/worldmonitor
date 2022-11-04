import { Component, Input, OnInit, 
  OnChanges, SimpleChanges } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryData } from '../country-data';

import { matches as hMatches, select as hSelect,
  selectAll as hSelectAll } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html'

@Component({
  selector: '[svgCountry]',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.less']
})
export class CountryComponent implements OnInit {

  countryId: string = '';
  countryTitle: string = '';
  @Input() countryEltJson: any;

  innerSvg: SafeHtml = '';
  @Output() broadcastId = new EventEmitter<CountryData>;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  clickCountry() {
    this.broadcastId.emit({id: this.countryId, title: this.countryTitle});
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.innerSvg = this.sanitizer.bypassSecurityTrustHtml(
      toHtml(changes['countryEltJson'].currentValue));
    this.countryId = this.countryEltJson.properties.id
    let titleTag = hSelect('title', this.countryEltJson);
    if (titleTag != null) {
      this.countryTitle = (titleTag.children[0] as HTMLInputElement).value;
    }
  }

}
