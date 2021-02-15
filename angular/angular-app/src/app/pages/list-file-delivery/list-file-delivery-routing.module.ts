import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFileDeliveryComponent } from './list-file-delivery.component';

const routes: Routes = [{
  path: '',
  component: ListFileDeliveryComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFileDeliveryRoutingModule { }
