import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BaseComponent } from '../shared/base/base.component';
import { AccountService } from '../core/services/account.service';
import { Router, RouterModule } from '@angular/router';
import { NAME_ONLY_HEADER } from '../core/models/table-headers.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseComponent implements OnInit {

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {
    super();
    this.title = 'Accounts';
    this.headers = NAME_ONLY_HEADER;
  }

  ngOnInit(): void {
    this.list$ = this.accountService.getAll();
  }

  add() {
    const name = window.prompt('Add new Category');
    if (name && name.trim()) {
      this.accountService.create({ name });
    }
  }

  edit(item: any) {
    const name = window.prompt('Edit Category', item.name);
    if (name && name.trim() && name !== item.name) {
      this.accountService.update({ ...item, name });
    }
  }

  delete(item: any) {
    const confirm = window.confirm(`Are you sure you want to delete ${ item.name }`);
    if (confirm) {
      this.accountService.delete(item.id);
    }
  }

  detail(id: string) {
    if (id) {
      this.router.navigateByUrl(`/accounts/${id}`);
    }
  }
}
