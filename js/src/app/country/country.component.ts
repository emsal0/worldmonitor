import { Component, Input, OnInit, 
  OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CountryData } from '../country-data';
import { FeedListService} from '../feed-list.service';

import { matches as hMatches, select as hSelect,
  selectAll as hSelectAll } from 'hast-util-select';
import { toHtml } from 'hast-util-to-html'

import { ReplaySubject, mergeMap, takeUntil } from 'rxjs';

@Component({
  selector: '[svgCountry]',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.less']
})
export class CountryComponent implements OnInit {

  countryId: string = '';
  countryTitle: string = '';
  hasSources: boolean = false;
  @Input() countryEltJson: any;

  innerSvg: SafeHtml = '';
  @Output() broadcastId = new EventEmitter<CountryData>;

  countryIdEvent$ = new ReplaySubject<void>(1);
  destroyed$ = new ReplaySubject<void>(1);

  constructor(
    private sanitizer: DomSanitizer,
    private feedService: FeedListService, 
  ) { }

  clickCountry() {
    this.broadcastId.emit({id: this.countryId, title: this.countryTitle});
  }

  ngOnInit(): void {
    this.countryIdEvent$.pipe(
      takeUntil(this.destroyed$),
      mergeMap( () => {
        return this.feedService.getFeeds(this.countryId);
      })
    ).subscribe( (feeds: Array<string>) => {
      if (feeds.length > 0) {
        this.hasSources = true;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.innerSvg = this.sanitizer.bypassSecurityTrustHtml(
      toHtml(changes['countryEltJson'].currentValue));
    this.countryId = this.countryEltJson.properties.id;
    this.countryIdEvent$.next();
    let titleTag = hSelect('title', this.countryEltJson);
    if (titleTag != null) {
      this.countryTitle = (titleTag.children[0] as HTMLInputElement).value;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }
}
