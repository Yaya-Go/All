import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BaseService, DocumentName } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class QuickMortgageService extends BaseService {

  constructor(firestore: Firestore, authService: AuthService) { 
    super(firestore, authService, DocumentName.QUICK_MORTGAGE);
  }
}
