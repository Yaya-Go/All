import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameFilterPipe } from './pipes/name-filter.pipe';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from './base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AddTransactionItemComponent } from './add-transaction-item/add-transaction-item.component';
import { DetailComponent } from './detail/detail.component';
import { RouterModule } from '@angular/router';
import { AddIncomeComponent } from './add-income/add-income.component';
import { NgChartsModule } from 'ng2-charts';
import { AddQuickComponent } from './add-quick/add-quick.component';
import { RemoveQuickComponent } from './remove-quick/remove-quick.component';

@NgModule({
  declarations: [
    NameFilterPipe,
    CustomTableComponent,
    BaseComponent,
    AddTransactionComponent,
    AddTransactionItemComponent,
    DetailComponent,
    AddIncomeComponent,
    AddQuickComponent,
    RemoveQuickComponent
  ],
  imports: [
    CommonModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    RouterModule,
    NgChartsModule
  ],
  exports: [
    NameFilterPipe,
    CustomTableComponent,
    BaseComponent,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    DetailComponent,
    NgChartsModule,
    RouterModule
  ]
})
export class SharedModule { }
