import { Injectable } from '@angular/core';
import { 
  CollectionReference, DocumentData, Firestore, 
  collection, deleteDoc, doc, docSnapshots,
  query, where, collectionChanges, setDoc, collectionData, docData,
  orderBy
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export enum DocumentName {
  GIFTGAME = 'gift-game',
  CATEGORY = 'category',
  ACCOUNT = 'account',
  TRANSACTION = 'transactions',
  TRANSACTION_ITEM = 'transaction-items',
  INCOME = 'income',
  QUICK = 'quick'
}

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  docName: string;
  collections: CollectionReference<DocumentData>;

  constructor(
    protected firestore: Firestore, 
    protected authService: AuthService,
    protected doc: DocumentName
  ) { 
    this.docName = doc;
    this.collections = collection(this.firestore, this.docName);
  }

  getAll(orderName?: string) {
    return collectionData(
      query(
        this.collections, 
        where('userId', '==', this.authService.useId),
        orderBy(orderName?orderName:'name', 'desc')
      ),
      { idField: 'id' }
    ) as Observable<any[]>
  }

  getAllWithId() {
    return collectionChanges(
      query(this.collections, where('userId', '==', this.authService.useId))
    ).pipe(map(
      (items) => items.map(item => ({ id: item.doc.id, ...item.doc.data() }))
    ));
  }

  get(id: string) {
    const reference = doc(this.firestore, `${this.docName}/${id}`);
    return docData(reference, { idField: 'id' });
  }

  getWithId(id: string) {
    const reference = doc(this.firestore, `${this.docName}/${id}`);
    return docSnapshots(reference).pipe(map(
      (item) => ({ id: item.id, ...item.data() })
    ));
  }

  create(item: any) {
    const id = doc(collection(this.firestore, '_')).id;
    const newItem = {
      ...item,
      id,
      userId: this.authService.useId,
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString()
    };
    const reference = doc(
      this.firestore,
      `${this.docName}/${id}`
    );
    return setDoc(reference, newItem);
  }

  update(item: any) {
    const reference = doc(
      this.firestore,
      `${this.docName}/${item.id}`
    );
    return setDoc(reference, { ...item, updatedAt: Date.now().toString() }, { merge: true });
  }

  delete(id: string) {
    const reference = doc(this.firestore, `${this.docName}/${id}`);
    return deleteDoc(reference);
  }
}
