import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturationTransportComponent } from './facturation-transport.component';
import { ListBillingComponent } from './list-billing/list-billing.component';
import { StatusJobsComponent } from './status-jobs/status-jobs.component';

const routes: Routes = [{
  path: '',
  component: StatusJobsComponent,
},
{
  path: 'billing',
  component: ListBillingComponent,
},
{
  path: 'factureSF',
  component: FacturationTransportComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturationTransportRoutingModule { }
