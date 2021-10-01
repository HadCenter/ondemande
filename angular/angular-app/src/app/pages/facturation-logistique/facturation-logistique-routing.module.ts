import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacturationLogistiqueComponent } from './facturation-logistique.component';


const routes: Routes =[{
  path: '',
  component: FacturationLogistiqueComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturationLogistiqueRoutingModule { }
