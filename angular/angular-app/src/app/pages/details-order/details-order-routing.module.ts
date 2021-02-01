import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsOrderComponent } from './details-order.component';


const routes: Routes = [{
  path: '',
  component: DetailsOrderComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsOrderRoutingModule { }
