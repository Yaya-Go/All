import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  submitted: boolean;
  isShowPassword: boolean;

  get controls(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isLoggedIn) {
      this.router.navigateByUrl('/home');
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.auth.SignIn(this.loginForm.value);
    }
  }
}
