import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuickMortgageService } from 'src/app/core/services/quick-mortgage.service';
import { QuickService } from 'src/app/core/services/quick.service';

@Component({
  selector: 'app-remove-quick',
  templateUrl: './remove-quick.component.html',
  styleUrls: ['./remove-quick.component.scss']
})
export class RemoveQuickComponent implements OnInit {

  @Input() type: string;
  
  quickList$: Observable<any[]>;
  constructor(
    private quickService: QuickService,
    private quickMortgageService: QuickMortgageService
  ) {}

  ngOnInit(): void {
    if (this.type === 'mortgage') {
      this.quickList$ = this.quickMortgageService.getAll();
    } else {
      this.quickList$ = this.quickService.getAll();
    }
  }

  remove(item: any) {
    const confirm = window.confirm(`Are you sure you want to remove ${item.name}?`);
    if (confirm) {
      if (this.type === 'mortgage') {
        this.quickMortgageService.delete(item.id);
      } else {
        this.quickService.delete(item.id);
      }
    }
  }
}
