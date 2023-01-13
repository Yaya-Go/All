import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRANSACTION_HEADERS } from 'src/app/core/models/table-headers.model';
import { AccountService } from 'src/app/core/services/account.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends BaseComponent {

  @Input() backUrl: string = '/home';
  @Input() type: 'account' | 'category';

  itemDetail: any;
  
  constructor(
    private modal: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private transService: TransactionService,
    private cateService: CategoryService,
    private accountService: AccountService
  ) {
    super();
    this.headers = TRANSACTION_HEADERS;
    this.title = 'Transactions';
    this.activatedRoute.params.subscribe(p => {
      if (p['id']) {
        this.id = p['id'];
        if (this.router.url.includes('accounts')){
          this.accountService.get(p['id']).subscribe(item => this.itemDetail = item);
        } else if (this.router.url.includes('category')) {
          this.cateService.get(p['id']).subscribe(item => this.itemDetail = item);
        }
        this.fetchTransactions();
      }
    });
  }

  fetchTransactions() {
    this.list$ = this.transService.getTransactionByCategory(this.id, this.currentYear, this.currentMonth);
    this.calcSummary();
  }

  addTransaction() {
    const modalRef = this.modal.open(AddTransactionComponent, {
      centered: true
    });
    modalRef.componentInstance[this.type] = this.itemDetail;
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

  detail(id: string) {
    if (id) {
      this.router.navigateByUrl(`/transactions/${id}`);
    }
  }
}
