import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MONTH_MAPPING } from 'src/app/core/models/date.model';
import { TableHeaders } from '../custom-table/custom-table.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {
  @Input() title: string;

  list$: Observable<any[]>;
  id: string;

  pagePerShow = 10;
  currentPage = 1;

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth()+1;

  headers: Array<TableHeaders>;

  summary: any = {
    length: 0,
    amount: 0
  };

  get startIndex() {
    return (this.currentPage - 1) * this.pagePerShow;
  }

  mapMonth() {
    return MONTH_MAPPING[this.currentMonth];
  }

  calcSummary() {
    this.list$.subscribe(list => {
      this.summary = {
        length: 0,
        amount: 0
      };
      this.summary.length = list.length;
      this.summary.amount = list.reduce((a, b) => a+b.amount, 0);
    });
  }
}
