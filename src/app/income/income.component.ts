import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeService } from '../core/services/income.service';
import { Observable } from 'rxjs';
import { TableHeaders } from '../shared/custom-table/custom-table.component';
import { INCOME_HEADERS } from '../core/models/table-headers.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddIncomeComponent } from '../shared/add-income/add-income.component';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {

  list$: Observable<any[]>;
  currentYear: number = new Date().getFullYear();

  summary = {
    length: 0,
    amount: 0,
    personal: 0,
    business: 0
  };

  headers: Array<TableHeaders>;

  pagePerShow = 25;
  currentPage = 1;

  get startIndex() {
    return (this.currentPage - 1) * this.pagePerShow;
  }

  constructor(
    private incomeService: IncomeService,
    private modal: NgbModal
  ) {
    this.headers = INCOME_HEADERS;
    this.fetch();    
  }

  prvYear() {
    this.currentYear--;
    this.fetch();
  }

  nextYear() {
    if (this.currentYear === new Date().getFullYear()) {
      return;
    }
    this.currentYear++;
    this.fetch();
  }

  fetch() {
    this.list$ = this.incomeService.getIncomeByYear(this.currentYear);
    this.calc();
  }

  calc() {
    this.list$.subscribe(list => {
      this.summary = {
        length: 0,
        amount: 0,
        personal: 0,
        business: 0
      };
      this.summary.length = list.length;
      list.forEach(l => {
        this.summary.amount += l.amount;
        if (l.type === 'Personal') {
          this.summary.personal += l.amount;
        } else if (l.type === 'Business') {
          this.summary.business += l.amount;
        }
      });
    });
  }

  add() {
    this.modal.open(AddIncomeComponent, {
      centered: true
    });
  }

  edit(item: any) {
    const modalRef = this.modal.open(AddIncomeComponent, {
      centered: true
    });
    modalRef.componentInstance.income = item;
  }

  delete(id: string) {
    const confirm = window.confirm('Are you sure you want to delete this income');
    if (confirm) {
      this.incomeService.delete(id);
    }
  }

}
