import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../core/services/transaction.service';
import { BaseComponent } from '../shared/base/base.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { AddTransactionComponent } from '../shared/add-transaction/add-transaction.component';
import { Router } from '@angular/router';
import { TRANSACTION_HEADERS } from '../core/models/table-headers.model';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent extends BaseComponent implements OnInit {

  categoryName: string[] = [];

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';

            if (label) {
                label += ': ';
            }
            if (context.formattedValue !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(context.formattedValue));
            }
            return label;
          }
        }
      }
    }
  };
  public pieChartLabels: any[];
  public pieChartDatasets: any;
  public pieChartLegend = false;
  public pieChartPlugins = [];

  constructor(
    private transService: TransactionService,
    private modal: NgbModal,
    private router: Router
  ) {
    super();
    this.title = 'Transactions';
    this.headers = TRANSACTION_HEADERS;
  }

  ngOnInit(): void {
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.list$ = this.transService.getTransactionByMonth(this.currentYear, this.currentMonth);
    this.calcSummary();
  }

  prvMonth() {
    this.currentMonth--;
    if (this.currentMonth === 0) {
      this.currentMonth = 12;
      this.currentYear--;
    }
    this.fetchTransactions();
  }

  nextMonth() {
    if (this.currentMonth === new Date().getMonth()+1) {
      return;
    }
    this.currentMonth++;
    if (this.currentMonth === 13) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.fetchTransactions();
  }

  add() {
    this.modal.open(AddTransactionComponent, {
      centered: true
    });
  }

  detail(id: string) {
    if (id) {
      this.router.navigateByUrl(`/transactions/${id}`);
    }
  }

  override calcSummary(): void {
    this.summary = {
      length: 0,
      amount: 0,
      category: {}
    };

    this.list$.subscribe(list => {
      this.summary.length = list.length;
      list.forEach(l => {
        this.summary.amount += l.amount;
        if (!this.summary.category[l.category.name]) {
          this.summary.category[l.category.name] = 0
        }
        this.summary.category[l.category.name] += l.amount;
      });

      this.pieChartLabels = Object.keys(this.summary.category);
      this.pieChartDatasets = [ {
        data: Object.values(this.summary.category)
      } ];
    });
  }
}
