import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IncomeService } from 'src/app/core/services/income.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss']
})
export class AddIncomeComponent implements OnInit {

  @Input() income: any;

  incomeForm: FormGroup;
  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.incomeForm.controls;
  }

  constructor(
    private incomeService: IncomeService,
    private modal: NgbModal,
    private fb: FormBuilder
  ) {
    this.incomeForm = this.fb.group({
      date: [{year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()}, [Validators.required]],
      from: ['', [Validators.required]],
      type: ['', [Validators.required]],
      amount: [0, [Validators.required]],
      id: [''],
      updatedAt: [''],
      createdAt: [''],
      userId: ['']
    });
  }

  ngOnInit(): void {
    if (this.income && this.income.id) {
      this.incomeForm.setValue({ ...this.income });
    }
  }
  
  onSubmit() {
    this.submitted = true;
    if (this.incomeForm.valid) {
      if (this.income && this.income.id) {
        this.incomeService.update(this.incomeForm.value).then(() => this.modal.dismissAll());
      } else {
        this.incomeService.create(this.incomeForm.value).then(() => this.modal.dismissAll());
      }
    }
  }
}
