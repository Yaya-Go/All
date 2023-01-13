import { Injectable } from '@angular/core';
import { collectionData, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BaseService, DocumentName } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService {

  constructor(firestore: Firestore, authService: AuthService) { 
    super(firestore, authService, DocumentName.TRANSACTION);
  }

  getTransactionByYear(year: number = new Date().getFullYear()) {
    return collectionData(
        query(this.collections, 
          where('userId', '==', this.authService.useId),
          where('date.year', '==', year),
          orderBy('date', 'desc')
        ),
        { idField: 'id' }
      ) as Observable<any[]>;
  }

  getTransactionByMonth(year: number = new Date().getFullYear(), month: number = new Date().getMonth()+1) {
    return collectionData(
        query(this.collections, 
          where('userId', '==', this.authService.useId),
          where('date.year', '==', year),
          where('date.month', '==', month),
          orderBy('date', 'desc')
        ),
        { idField: 'id' }
      ) as Observable<any[]>;
  }

  getTransactionByCategory(categoryId: string, year: number = new Date().getFullYear(), month: number = new Date().getMonth()+1) {
    return collectionData(
        query(this.collections, 
          where('userId', '==', this.authService.useId),
          where('category.id', '==', categoryId),
          where('date.year', '==', year),
          where('date.month', '==', month),
          orderBy('date', 'desc')
        ),
        { idField: 'id' }
      ) as Observable<any[]>;
  }

  // getTransactionByAccount(accountId: string, year: number = new Date().getFullYear(), month: number = new Date().getMonth()+1) {
  //   return collectionData(
  //       query(this.collections, 
  //         where('userId', '==', this.authService.useId),
  //         where('account.id', '==', accountId),
  //         where('date.year', '==', year),
  //         where('date.month', '==', month),
  //         orderBy('date', 'desc')
  //       ),
  //       { idField: 'id' }
  //     ) as Observable<any[]>;
  // }
}
