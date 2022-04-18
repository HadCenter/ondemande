import { NgModule } from '@angular/core';
import { LayoutsModule } from './layouts';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './layouts/common-layout';
import { AuthGuard } from '../app/services/auth/auth.guard';
import { BlankLayoutComponent } from './layouts/blank-layout';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'prefix' },  //make sure to NOT lazy load the initial route

  {
    path: '', component: CommonLayoutComponent, children: [
      { path: 'list-file-edi-archives', loadChildren: () => import('./pages/list-file-edi-archives/list-file-edi-archives.module').then(m => m.ListFileEdiArchivesModule), canActivate: [AuthGuard] },
      { path: 'logistique-archives', loadChildren: () => import('./pages/logistique-archives/logistique-archives.module').then(m => m.LogistiqueArchivesModule), canActivate: [AuthGuard] },
      { path: 'list-file-edi', loadChildren: () => import('./pages/list-file-edi/list-file-edi.module').then(m => m.ListFileEdiModule), canActivate: [AuthGuard] },
      { path: 'logistique', loadChildren: () => import('./pages/magistor/magistor.module').then(m => m.MagistorModule), canActivate: [AuthGuard] },
      { path: 'details-file-logistique/:id', loadChildren: () => import('./pages/magistor/details-file-magistor/details-file-magistor.module').then(m => m.DetailsFileMagistorModule), canActivate: [AuthGuard] },
      { path: 'list-client', loadChildren: () => import('./pages/list-clients/list-clients.module').then(m => m.ListClientsModule), canActivate: [AuthGuard] },
      { path: 'details-file-edi/:id', loadChildren: () => import('./pages/details-file-edi/details-file-edi.module').then(m => m.DetailsFileEdiModule), canActivate: [AuthGuard] },
      { path: 'details-transaction/:id', loadChildren: () => import('./pages/details-transaction/details-transaction.module').then(m => m.DetailsTransactionModule), canActivate: [AuthGuard] },
      { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard] },
      { path: 'list-transaction', loadChildren: () => import('./pages/list-transaction/list-transaction.module').then(m => m.ListTransactionModule), canActivate: [AuthGuard] },
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
      { path: 'profil', loadChildren: () => import('./pages/profil/profil.module').then(m => m.ProfilModule), canActivate: [AuthGuard] },
      { path: 'details-user/:id', loadChildren: () => import('./pages/details-user/details-user.module').then(m => m.DetailsUserModule), canActivate: [AuthGuard] },
      { path: 'facturation-logistique', loadChildren: () => import('./pages/facturation-logistique/facturation-logistique.module').then(m => m.FacturationLogistiqueModule), canActivate: [AuthGuard] },
      { path: 'facturation-preparation', loadChildren: () => import('./pages/list-facturation-preparation/list-facturation-preparation.module').then(m => m.ListFacturationPreparationModule), canActivate: [AuthGuard] },
      { path: 'liste-facturation-preparation/:client', loadChildren: () => import('./pages/facturation-preparation/facturation-preparation.module').then(m => m.FacturationPreparationModule), canActivate: [AuthGuard] },
      { path: 'add-facture/:client/:date', loadChildren: () => import('./pages/add-facture/add-facture.module').then(m => m.AddFactureModule), canActivate: [AuthGuard] },
      { path: 'details-facture/:client/:facture', loadChildren: () => import('./pages/details-facture/details-facture.module').then(m => m.DetailsFactureModule), canActivate: [AuthGuard] },
      { path: 'configuration-critere/:id', loadChildren: () => import('./pages/config-critere/config-critere.module').then(m => m.ConfigCritereModule), canActivate: [AuthGuard] },
      { path: 'config-jour-ferie', loadChildren: () => import('./pages/config-jour-ferie/config-jour-ferie.module').then(m => m.ConfigJourFerieModule), canActivate: [AuthGuard] },
      { path: 'rapports', loadChildren: () => import('./pages/powerbi-embedded/powerbi-embedded.module').then(m => m.PowerbiEmbeddedModule), canActivate: [AuthGuard] },
      { path: 'details-rapport/:id', loadChildren: () => import('./pages/details-kpi-powerbi/details-kpi-powerbi.module').then(m => m.DetailsKpiPowerbiModule), canActivate: [AuthGuard] },

    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
      { path: 'forget-password', loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
      { path: 'user-password', loadChildren: () => import('./pages/user-password/user-password.module').then(m => m.UserPasswordModule) },
      { path: 'forgot-password', loadChildren: () => import('./pages/forgot-password-token/forgot-password-token.module').then(m => m.ForgotPasswordTokenModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' }), LayoutsModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
