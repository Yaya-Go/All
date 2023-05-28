import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuickMortgageService } from 'src/app/core/services/quick-mortgage.service';

@Component({
  selector: 'app-add-quick-mortgage',
  templateUrl: './add-quick-mortgage.component.html',
  styleUrls: ['./add-quick-mortgage.component.scss']
})
export class AddQuickMortgageComponent {
  mortgageForm: FormGroup;
  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.mortgageForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private modal: NgbModal,
    private mortgageService: QuickMortgageService
  ) {
    this.mortgageForm = this.fb.group({
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
