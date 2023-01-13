import { Component } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { TransactionService } from '../core/services/transaction.service';
import { IncomeService } from '../core/services/income.service';
import { combineLatest } from 'rxjs';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  currentYear = new Date().getFullYear();
  
  summary: any = {
    [this.currentYear]: {
      transaction: 0,
      income: 0
    },
    [this.currentYear-1]: {
      transaction: 0,
      income: 0
    },
    [this.currentYear-2]: {
      transaction: 0,
      income: 0
    }
  };

  isLoading = false;

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'];

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
              return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
          }
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';

            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    }
  };

  constructor(
    private transService: TransactionService,
    private incomeService: IncomeService,
    private auth: AuthService,
    private router: Router
  ) {
    if (!this.auth.isLoggedIn) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
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
        trans0.forEach(t => this.summary[this.currentYear].transaction += t.amount);
        income0.forEach(t => this.summary[this.currentYear].income += t.amount);

        trans1.forEach(t => this.summary[this.currentYear-1].transaction += t.amount);
        income1.forEach(t => this.summary[this.currentYear-1].income += t.amount);

        trans2.forEach(t => this.summary[this.currentYear-2].transaction += t.amount);
        income2.forEach(t => this.summary[this.currentYear-2].income += t.amount);

        this.barChartData = {
          labels: [ this.currentYear, this.currentYear-1, this.currentYear-2 ],
          datasets: [
            { data: [
              this.summary[this.currentYear].transaction, 
              this.summary[this.currentYear-1].transaction,
              this.summary[this.currentYear-2].transaction
            ], label: 'Transaction' },
            { data: [
              this.summary[this.currentYear].income, 
              this.summary[this.currentYear-1].income,
              this.summary[this.currentYear-2].income
            ], label: 'Income' }
          ]
        }

        this.isLoading = false;
      });
  }
}
