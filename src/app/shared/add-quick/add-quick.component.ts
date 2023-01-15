import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { QuickService } from 'src/app/core/services/quick.service';

@Component({
  selector: 'app-add-quick',
  templateUrl: './add-quick.component.html',
  styleUrls: ['./add-quick.component.scss']
})
export class AddQuickComponent implements OnInit {

  quickForm: FormGroup;
  categoryList$: Observable<any[]>;
  submitted: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.quickForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private cateService: CategoryService,
    private quickService: QuickService,
    private modal: NgbModal
  ) {
    this.quickForm = this.fb.group({
      name: ['', [Validators.required]],
      category: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.categoryList$ = this.cateService.getAll();
  }

  onSubmit() {
    this.submitted = true;
    if (this.quickForm.valid) {
      this.quickService.create({ ...this.quickForm.value }).then(() => {
        this.modal.dismissAll();
      });
    }
  }
}
