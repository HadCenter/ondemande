import { NgModule } from '@angular/core';

import { LayoutsModule } from './layouts';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout';

import { AuthGuard } from '../app/services/auth/auth.guard';
import { BlankLayoutComponent } from './layouts/blank-layout';

const routes: Routes = [
  { path: '', redirectTo: 'list-file-edi', pathMatch: 'prefix' },
  {
    path: '', component: CommonLayoutComponent, children: [
      { path: 'list-file-edi', loadChildren: () => import('./pages/list-file-edi/list-file-edi.module').then(m => m.ListFileEdiModule), canActivate: [AuthGuard] },
      { path: 'list-client', loadChildren: () => import('./pages/list-clients/list-clients.module').then(m => m.ListClientsModule), canActivate: [AuthGuard] },
      { path: 'create-client', loadChildren: () => import('./pages/create-client/create-client.module').then(m => m.CreateClientModule), canActivate: [AuthGuard] },
      { path: 'import-file-edi', loadChildren: () => import('./pages/import-file-edi/import-file-edi.module').then(m => m.ImportFileEdiModule), canActivate: [AuthGuard] },
      { path: 'details-client/:id', loadChildren: () => import('./pages/details-client/details-client.module').then(m => m.DetailsClientModule), canActivate: [AuthGuard] },
      { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard] },
      { path: 'list-file-delivery', loadChildren: () => import('./pages/list-file-delivery/list-file-delivery.module').then(m => m.ListFileDeliveryModule), canActivate: [AuthGuard] },







      /*{ path: 'list-orders', loadChildren: () => import('./pages/list-orders/list-orders.module').then(m => m.ListOrdersModule), canActivate: [AuthGuard] },
      /*{ path: 'details-order/:id', loadChildren: () => import('./pages/details-order/details-order.module').then(m => m.DetailsOrderModule), canActivate: [AuthGuard] },*/
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
