import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../core/services/transaction.service';
import { ChartConfiguration, ChartOptions,  } from 'chart.js';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-statistic',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent {

  selectedYear: number = new Date().getFullYear();
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  summary: any = {};
  categoryName: any[] = [];
  categorySummary: any = {};
  filterType: string = 'monthly';

  // bar
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.months,
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'];

  // pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  
  public pieChartDatasets = [ {
    data: []
  } ];
  public pieChartLegend = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transService: TransactionService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(p => {
      if (p['year']) {
        if (isNaN(p['year'])) {
          this.router.navigateByUrl('/home');
        }
        this.selectedYear = Number(p['year']);
      }

      this.buildOptions();

      this.transService.getTransactionByYear(this.selectedYear)
        .subscribe(list => {
          list.forEach(l => {
            if (this.categoryName.indexOf(l.category.name) === -1) {
              this.categoryName.push(l.category.name);
            }
            if (!this.summary[l.category.name]) {
              this.summary[l.category.name] = new Array(12).fill(0);
            }
            this.summary[l.category.name][l.date.month-1] += l.amount;

            if (!this.categorySummary[l.category.name]) {
              this.categorySummary[l.category.name] = 0;
            }
            this.categorySummary[l.category.name] += l.amount;
          });
  
          this.barChartData.datasets = this.buildDataset();
          this.pieChartDatasets[0].data = Object.values(this.categorySummary);
        });
    });
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  buildOptions() {
    this.barChartOptions = {
      responsive: true,
      scales: {
        y: {
          stacked: true,
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
                return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
            }
          }
        },
        x: {
          stacked: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: `${this.selectedYear} Transaction Summary`
        },
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
      },
      interaction: {
        intersect: false,
      }
    };
  }

  buildDataset() {
    return this.categoryName.map(name => ({ data: this.summary[name], backgroundColor: this.getRandomColor(), label: name }));
  }
}
