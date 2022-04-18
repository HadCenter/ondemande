import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFacturationPreparationComponent } from './list-facturation-preparation.component';

const routes: Routes = [{
  path: '',
  component: ListFacturationPreparationComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFacturationPreparationRoutingModule { }
