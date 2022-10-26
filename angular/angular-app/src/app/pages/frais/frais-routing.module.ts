import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { fraisComponent } from './frais.component';

const routes: Routes = [{
  path: '',
  component: fraisComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class fraisRoutingModule { }
