import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../core/services/transaction.service';
import { IncomeService } from '../core/services/income.service';
import { combineLatest, map, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentYear = new Date().getFullYear();
  
  summary: any = {
    [this.currentYear]: {
      transactions: {
        length: 0,
        amount: 0
      },
      income: {
        length: 0,
        amount: 0
      }
    },
    [this.currentYear-1]: {
      transactions: {
        length: 0,
        amount: 0
      },
      income: {
        length: 0,
        amount: 0
      }
    },
    [this.currentYear-2]: {
      transactions: {
        length: 0,
        amount: 0
      },
      income: {
        length: 0,
        amount: 0
      }
    }
  };

  isLoading = false;
  constructor(
    private transService: TransactionService,
    private incomeService: IncomeService
  ) {
    this.isLoading = true;
    combineLatest([
      this.transService.getTransactionByYear(),
      this.incomeService.getIncomeByYear(),
      this.transService.getTransactionByYear(this.currentYear-1),
      this.incomeService.getIncomeByYear(this.currentYear-1),
      this.transService.getTransactionByYear(this.currentYear-2),
      this.incomeService.getIncomeByYear(this.currentYear-2)
    ])
      .subscribe(([trans0, income0, trans1, income1, trans2, income2]) => {
        this.summary[this.currentYear].transactions.length = trans0.length;
        this.summary[this.currentYear].income.length = income0.length;
        trans0.forEach(t => this.summary[this.currentYear].transactions.amount += t.amount);
        income0.forEach(t => this.summary[this.currentYear].income.amount += t.amount);

        this.summary[this.currentYear-1].transactions.length = trans1.length;
        this.summary[this.currentYear-1].income.length = income1.length;
        trans1.forEach(t => this.summary[this.currentYear-1].transactions.amount += t.amount);
        income1.forEach(t => this.summary[this.currentYear-1].income.amount += t.amount);

        this.summary[this.currentYear-2].transactions.length = trans2.length;
        this.summary[this.currentYear-2].income.length = income2.length;
        trans2.forEach(t => this.summary[this.currentYear-2].transactions.amount += t.amount);
        income2.forEach(t => this.summary[this.currentYear-2].income.amount += t.amount);

        this.isLoading = false;
      });
  }
}
