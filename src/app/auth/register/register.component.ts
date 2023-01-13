import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  submitted: boolean;

  isShowPassword: boolean;
  isShowConfirm: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.ConfirmedValidator('password', 'confirmPassword')
    });
  }

  ConfirmedValidator(controlName: string, confirmControl: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[confirmControl];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  showConfirm() {
    this.isShowConfirm = !this.isShowConfirm;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      this.auth.SignUp(
        this.registerForm.controls['email'].value, 
        this.registerForm.controls['password'].value, 
        this.registerForm.controls['name'].value
      );
    }
  }
}
