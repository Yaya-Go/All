import { Route } from "@angular/router";
import { AccountDetailComponent } from "./account-detail/account-detail.component";
import { AccountComponent } from "./account.component";

export default [
  {path: '', component: AccountComponent},
  {path: ':id', component: AccountDetailComponent}
] as Route[];
