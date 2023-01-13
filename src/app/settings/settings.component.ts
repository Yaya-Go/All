import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  displayName: string;

  constructor(
    private auth: AuthService
  ) {
    this.auth.userName.subscribe(name => this.displayName = name);
  }

  changeDisplay() {
    const name = window.prompt('Change Display Name', this.displayName);
    if (name && name.trim() && name !== this.displayName) {
      this.auth.updateDisplayName(name);
    }
  }

  changePassword() {
    const confirm = window.confirm('Are you sure you want to change password');
    if (confirm) {
      this.auth.user.subscribe(user => {
        if (user && user.email) {
          this.auth.ForgotPassword(user.email, true);
        }
      });
    }
  }
}
