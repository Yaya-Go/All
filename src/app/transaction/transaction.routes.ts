import { Route } from "@angular/router";
import { TransactionDetailComponent } from "./transaction-detail/transaction-detail.component";
import { TransactionComponent } from "./transaction.component";

export default [
  {path: '', component: TransactionComponent},
  {path: ':id', component: TransactionDetailComponent}
] as Route[];
