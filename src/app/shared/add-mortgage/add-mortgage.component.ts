import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MortgageService } from 'src/app/core/services/mortgage.service';

@Component({
  selector: 'app-add-mortgage',
  templateUrl: './add-mortgage.component.html',
  styleUrls: ['./add-mortgage.component.scss']
})
export class AddMortgageComponent {

  mortgageForm: FormGroup;
  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.mortgageForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private mortgageService: MortgageService
  ) {
    this.mortgageForm = this.fb.group({
      date: [
        {year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()}, 
        [Validators.required]
      ],
      name: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.mortgageForm.valid) {
      this.mortgageService.create(this.mortgageForm.value).then(() => this.modal.dismissAll());
    }
  }
}
