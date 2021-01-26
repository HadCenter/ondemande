import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthGuardService } from './guards/unauth-guard.service';
import { AuthComponent } from './web/auth/auth.component';
import { LoginComponent } from './web/auth/login/login.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [UnauthGuardService],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
