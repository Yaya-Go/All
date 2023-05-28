import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
// import { GiftGameComponent } from './gift-game/gift-game.component';
import { HomeComponent } from './home/home.component';
import { IncomeComponent } from './income/income.component';
import { MortgageComponent } from './mortgage/mortgage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'auth', loadChildren: () => import('./auth/auth.routes')
  },
  {
    canActivate: [AuthGuard],
    path: 'home', component: HomeComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'settings', loadChildren: () => import('./settings/settings.routes')
  },
  {
    canActivate: [AuthGuard],
    path: 'statistic', loadChildren: () => import('./statistic/statistic.routes')
  },
  // {
  //   canActivate: [AuthGuard],
  //   path: 'gift-game', component: GiftGameComponent
  // },
  {
    canActivate: [AuthGuard],
    path: 'category', loadChildren: () => import('./category/category.routes')
  },
  // {
  //   canActivate: [AuthGuard],
  //   path: 'accounts', loadChildren: () => import('./account/account.routes')
  // },
  {
    canActivate: [AuthGuard],
    path: 'transactions', loadChildren: () => import('./transaction/transaction.routes')
  },
  {
    canActivate: [AuthGuard],
    path: 'income', component: IncomeComponent
  },
  {
    canActivate: [AuthGuard],
    path: 'mortgage', component: MortgageComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
