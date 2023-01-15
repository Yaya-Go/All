import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuickService } from 'src/app/core/services/quick.service';

@Component({
  selector: 'app-remove-quick',
  templateUrl: './remove-quick.component.html',
  styleUrls: ['./remove-quick.component.scss']
})
export class RemoveQuickComponent implements OnInit {

  quickList$: Observable<any[]>;
  constructor(
    private quickService: QuickService
  ) {}

  ngOnInit(): void {
    this.quickList$ = this.quickService.getAll();
  }

  remove(item: any) {
    const confirm = window.confirm(`Are you sure you want to remove ${item.name}?`);
    if (confirm) {
      this.quickService.delete(item.id);
    }
  }
}
