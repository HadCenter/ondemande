import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordTokenComponent } from './forgot-password-token.component';

const routes: Routes = [{
  path: '',
  component: ForgotPasswordTokenComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForgotPasswordTokenRoutingModule { }
