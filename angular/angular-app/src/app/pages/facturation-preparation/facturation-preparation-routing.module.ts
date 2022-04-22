import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturationPreparationComponent } from './facturation-preparation.component';

const routes: Routes = [{
  path: '',
  component: FacturationPreparationComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturationPreparationRoutingModule { }
