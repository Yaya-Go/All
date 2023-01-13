import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../core/services/category.service';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  list$: Observable<any[]>;
  
  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.list$ = this.categoryService.getAll('name');
  }

  add() {
    const name = window.prompt('Add new Category');
    if (name && name.trim()) {
      this.categoryService.create({ name });
    }
  }

  edit(item: any) {
    const name = window.prompt('Edit Category', item.name);
    if (name && name.trim() && name !== item.name) {
      this.categoryService.update({ ...item, name });
    }
  }

  delete(item: any) {
    const confirm = window.confirm(`Are you sure you want to delete ${ item.name }`);
    if (confirm) {
      this.categoryService.delete(item.id);
    }
  }

  detail(id: string) {
    if (id) {
      this.router.navigateByUrl(`/category/${id}`);
    }
  }
  
}
