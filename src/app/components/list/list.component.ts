import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DefaultMenuSelection } from 'src/app/consts';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  constructor() { }

  @Input() items: string[];
  @Output() selected: EventEmitter<string> = new EventEmitter();
  @Input() selectedItem = DefaultMenuSelection;
  @Input() disabled = false;

  public defaultMenuSelection = DefaultMenuSelection;

  onChange(newValue: string) {
    this.selected.emit(newValue);
  }


}
