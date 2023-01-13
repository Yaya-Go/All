import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isLoggedIn: boolean;
  userName: string;

  constructor(private auth: AuthService) {
    this.auth.user.subscribe((user) => {
      this.isLoggedIn = (user !== null && (user.emailVerified !== false ? true : false));
    });
    this.auth.userName.subscribe(name => this.userName = name);
  }

  logout() {
    this.auth.SignOut();
  }
}
