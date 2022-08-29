import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-newspanel',
  templateUrl: './newspanel.component.html',
  styleUrls: ['./newspanel.component.less']
})
export class NewspanelComponent implements OnInit {

  @Input() country_cursor: string = 'unselected';

  constructor() { }

  ngOnInit(): void {
  }

}
