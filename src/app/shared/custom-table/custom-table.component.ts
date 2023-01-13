import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableHeaders {
  className?: string;
  name: string;
}

@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent {

  @Input() headers: Array<TableHeaders>;
  @Output() add = new EventEmitter();

  addItem() {
    this.add.emit();
  }
}
