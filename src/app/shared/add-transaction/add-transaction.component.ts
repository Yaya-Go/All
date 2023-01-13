import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, take } from 'rxjs';
// import { AccountService } from 'src/app/core/services/account.service';
import { CategoryService } from 'src/app/core/services/category.service';
import { TransactionService } from 'src/app/core/services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss']
})
export class AddTransactionComponent implements OnInit {

  @Input() transaction: any;
  @Input() category: any;
  // @Input() account: any;

  categoryList: any[];
  // accountList$: Observable<any[]>;
  transForm: FormGroup;
  categoryList$: Observable<any[]>;

  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.transForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    // private accountService: AccountService,
    private transService: TransactionService,
    private modal: NgbModal
  ) {
    this.transForm = this.fb.group({
      date: [
        { day: new Date().getDate(), month: new Date().getMonth()+1, year: new Date().getFullYear() },
        [Validators.required]
      ],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      // account: [null],
      amount: ['', [Validators.required]],
      rates: [0],
      address: [''],
      comments: [''],
      id: [''],
      updatedAt: [''],
      createdAt: [''],
      userId: ['']
    });
    this.transForm.controls['categoryId'].valueChanges.subscribe(event => {
      const category = this.categoryList.filter(c => c.id === event)[0];
      this.transForm.controls['category'].setValue(category);
    });
  }

  ngOnInit(): void {
    this.categoryList$ = this.categoryService.getAll();
    this.categoryList$.subscribe(list => {
      this.categoryList = list;
      
      if (this.transaction && this.transaction.id) {
        this.transForm.setValue(this.transaction);
      }
  
      if (this.category && this.category.id) {
        this.transForm.controls['categoryId'].setValue(this.category.id);
        this.transForm.controls['category'].setValue(this.category);
      }
    });
    // this.accountList$ = this.accountService.getAll();
    
    // if (this.account && this.account.id) {
    //   this.transForm.controls['account'].setValue(this.account);
    // }
  }

  onSubmit() {
    this.submitted = true;
    if (this.transForm.valid) {
      if (this.transaction && this.transaction.id) {
        this.transService.update({ ...this.transForm.value })
          .then(() => this.modal.dismissAll());
      } else {
        this.transService.create({ ...this.transForm.value })
          .then(() => this.modal.dismissAll());
      }
    }
  }
}
