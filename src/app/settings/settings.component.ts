import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddQuickComponent } from '../shared/add-quick/add-quick.component';
import { RemoveQuickComponent } from '../shared/remove-quick/remove-quick.component';
import { AddQuickMortgageComponent } from '../shared/add-quick-mortgage/add-quick-mortgage.component';

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
    private auth: AuthService,
    private modal: NgbModal
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

  setQuick() {
    this.modal.open(AddQuickComponent, {
      centered: true
    });
  }

  removeQuick() {
    this.modal.open(RemoveQuickComponent, {
      centered: true
    });
  }

  setQuickMortgage() {
    this.modal.open(AddQuickMortgageComponent, {
      centered: true
    });
  }

  removeQuickMortgage() {
    const modal = this.modal.open(RemoveQuickComponent, {
      centered: true
    });

    modal.componentInstance.type = 'mortgage';
  }
}
