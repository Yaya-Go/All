import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddTransactionComponent } from 'src/app/shared/add-transaction/add-transaction.component';
import { TableHeaders } from 'src/app/shared/custom-table/custom-table.component';
import { Observable } from 'rxjs';
import { AddTransactionItemComponent } from 'src/app/shared/add-transaction-item/add-transaction-item.component';
import { BaseComponent } from 'src/app/shared/base/base.component';
import { TransactionItemService } from 'src/app/core/services/transaction-item.service';
import { TRANSACTION_ITEM_HEADERS } from 'src/app/core/models/table-headers.model';

@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent extends BaseComponent {

  transaction: any;
  itemHeaders: TableHeaders[];
  itmeList$: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private transService: TransactionService,
    private itemService: TransactionItemService,
    private modal: NgbModal,
    private router: Router
  ) {
    super();
    this.activatedRoute.params.subscribe(p => {
      if (p['id']) {
        this.transService.get(p['id']).subscribe(t => {
          this.transaction = t;
          this.itmeList$ = this.itemService.getByTransId(p['id']);
        });
      }
    });
    this.itemHeaders = TRANSACTION_ITEM_HEADERS;
  }

  edit() {
    const modalRef = this.modal.open(AddTransactionComponent, {
      centered: true
    });
    modalRef.componentInstance.transaction = this.transaction;
  }

  delete() {
    const confirm = window.confirm('Are you sure you want to delete this transaction');
    if (confirm) {
      const id = this.transaction.id;
      this.itemService.deleteItems(id)
        .subscribe(() => {
          this.transService.delete(id)
            .then(() => {
              this.router.navigateByUrl('/transactions');
            });
        });
    }
  }

  addItem() {
    const modalRef = this.modal.open(AddTransactionItemComponent, {
      centered: true
    });
    modalRef.componentInstance.transId = this.transaction.id;
  }

  editItem(item: any) {
    const modalRef = this.modal.open(AddTransactionItemComponent, {
      centered: true
    });
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.transId = this.transaction.id;
  }

  deleteItem(item: any) {
    const confirm = window.confirm(`Are you sure you want to delete item - ${ item.name }`);
    if (confirm) {
      this.itemService.delete(item.id);
    }
  }
}
