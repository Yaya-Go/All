import { Injectable } from '@angular/core';
import { collectionData, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BaseService, DocumentName } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class IncomeService extends BaseService {

  constructor(firestore: Firestore, authService: AuthService) { 
    super(firestore, authService, DocumentName.INCOME);
  }

  getIncomeByYear(year: number = new Date().getFullYear()) {
    return collectionData(
      query(this.collections, 
        where('userId', '==', this.authService.useId),
        where('date.year', '==', year),
        orderBy('date', 'desc')
      ),
      { idField: 'id' }
    ) as Observable<any[]>;
  }
}
