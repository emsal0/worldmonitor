import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.less']
})
export class CountryComponent implements OnInit {

  countryId: string = '';
  @Input() innerSvg: SafeHtml = '';
  @Output() broadcastId = new EventEmitter<string>;

  constructor() { }

  clickCountry() {
    this.broadcastId.emit(this.countryId);
  }

  ngOnInit(): void {
  }

}
