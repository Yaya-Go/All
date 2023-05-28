import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MortgageService } from '../core/services/mortgage.service';
import { Observable } from 'rxjs';
import { TableHeaders } from '../shared/custom-table/custom-table.component';
import { MORTGAGE_HEADERS } from '../core/models/table-headers.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMortgageComponent } from '../shared/add-mortgage/add-mortgage.component';
import { SharedModule } from '../shared/shared.module';
import { QuickMortgageService } from '../core/services/quick-mortgage.service';

@Component({
  selector: 'app-mortgage',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.scss']
})
export class MortgageComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  headers: Array<TableHeaders>;
  list$: Observable<any[]>;
  quickList$: Observable<any[]>;
  summary: any = {};
  total: number = 0;
  currentPage = 1;
  pagePerShow = 25;
  mortgageList: string[] = [];

  get startIndex() {
    return (this.currentPage - 1) * this.pagePerShow;
  }

  constructor(
    private mortgageService: MortgageService,
    private quickMortgageService: QuickMortgageService,
    private modal: NgbModal
  ) {
    this.headers = MORTGAGE_HEADERS;
  }

  ngOnInit(): void {
    this.fetch();
    this.quickList$ = this.quickMortgageService.getAll();
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
    this.list$ = this.mortgageService.getAllByYear(this.currentYear);
    this.calc();
  }

  add() {
    this.modal.open(AddMortgageComponent, {
      centered: true
    });
  }

  addQuick(item: any) {
    item.date = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate()};
    this.mortgageService.create(item).then(() => window.alert('Create successfully.'));
  }
  delete(item: any) {
    const confirm = window.confirm(`Are you sure you want to delete mortgage ${item.name}`);
    if (confirm) {
      this.mortgageService.delete(item.id);
    }
  }
  calc() {
    this.list$.subscribe(list => {
      this.total = 0;
      this.summary = {};
      this.mortgageList = [];
      list.forEach(l => {
        this.total += l.amount;
        if (!this.summary[l.name.toLowerCase().trim()]) {
          this.summary[l.name.toLowerCase().trim()] = 0;
        }
        if (this.mortgageList.indexOf(l.name.toLowerCase().trim()) === -1) {
          this.mortgageList.push(l.name.toLowerCase().trim());
        }
        this.summary[l.name.toLowerCase().trim()] +=l.amount;
      });
    });
  }
}
