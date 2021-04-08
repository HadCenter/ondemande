import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsTransactionComponent } from './details-transaction.component';


const routes: Routes = [{
  path: '',
  component: DetailsTransactionComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsTransactionRoutingModule { }
