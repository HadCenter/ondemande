import { NgModule } from '@angular/core';

import { LayoutsModule } from './layouts';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout';

import { AuthGuard } from '../app/services/auth/auth.guard';
import { BlankLayoutComponent } from './layouts/blank-layout';

const routes: Routes = [
  { path: '', redirectTo: 'list-orders', pathMatch: 'prefix' },
  {
    path: '', component: CommonLayoutComponent, children: [
      { path: 'list-orders', loadChildren: () => import('./pages/list-orders/list-orders.module').then(m => m.ListOrdersModule), canActivate: [AuthGuard] },
      { path: 'details-order/:id', loadChildren: () => import('./pages/details-order/details-order.module').then(m => m.DetailsOrderModule), canActivate: [AuthGuard] },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
  { path: 'sign-up', loadChildren: () => import('./pages/sign-up/sign-up.module').then(m => m.SignUpModule) },
  { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), LayoutsModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
