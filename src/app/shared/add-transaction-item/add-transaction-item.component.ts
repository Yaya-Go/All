import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionItemService } from 'src/app/core/services/transaction-item.service';

@Component({
  selector: 'app-add-transaction-item',
  templateUrl: './add-transaction-item.component.html',
  styleUrls: ['./add-transaction-item.component.scss']
})
export class AddTransactionItemComponent implements OnInit {

  @Input() transId: string;
  @Input() item: any;

  itemForm: FormGroup;
  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.itemForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private itemService: TransactionItemService,
    private modal: NgbModal
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required]],
      rates: [0],
      amount: [''],
      comments: [''],
      transactionId: ['', [Validators.required]],
      id: [''],
      updatedAt: [''],
      createdAt: [''],
      userId: ['']
    });
  }

  ngOnInit(): void {
    this.itemForm.controls['transactionId'].setValue(this.transId);
    if (this.item && this.item.id) {
      this.itemForm.setValue({ ...this.item });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.itemForm.valid) {
      if (this.item && this.item.id) {
        this.itemService.update(this.itemForm.value).then(() => this.modal.dismissAll());
      } else {
        this.itemService.create(this.itemForm.value).then(() => this.modal.dismissAll());
      }
    }
  }
}
