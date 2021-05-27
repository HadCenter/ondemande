import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MagistorComponent } from './magistor.component';

const routes: Routes = [{
  path: '',
  component: MagistorComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MagistorRoutingModule { }

