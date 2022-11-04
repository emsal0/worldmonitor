import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'newspanel-add-source-input',
  templateUrl: './add-source-input.component.html',
  styleUrls: ['./add-source-input.component.less']
})
export class AddSourceInputComponent implements OnInit, OnChanges {
  @Input() id: number = -1;
  @Input() id_string: string = '';
  @Output() addSource = new EventEmitter<{id: string, feedUrl: string}>;
  @Output() removeSource = new EventEmitter<string>;
  sourceField: FormControl = new FormControl('');

  emitAdd() {
    this.addSource.emit({ id: this.id_string,
                          feedUrl: this.sourceField.value });
  }
  emitRemove() {
    this.removeSource.emit(this.id_string);
  }

  ngOnInit() { }

  ngOnChanges() { }
}
