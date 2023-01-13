import { Injectable } from '@angular/core';
import { collectionData, Firestore, query, where, writeBatch, doc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BaseService, DocumentName } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionItemService extends BaseService {

  constructor(firestore: Firestore, authService: AuthService) { 
    super(firestore, authService, DocumentName.TRANSACTION_ITEM);
  }

  getByTransId(transId: string) {
    return collectionData(
      query(this.collections, 
        where('userId', '==', this.authService.useId),
        where('transactionId', '==', transId)
      ),
      { idField: 'id' }
      ) as Observable<any[]>;
  }

  deleteItems(transId: string) {
    const batch = writeBatch(this.firestore);

    return this.getByTransId(transId)
      .pipe(
        map(items => {
          items.forEach(item => {
            console.log(item);
            batch.delete(doc(this.firestore, `${ DocumentName.TRANSACTION_ITEM }/${ item.id }`));
          });
        }),
        map(() => batch.commit())
      );
  }
}
