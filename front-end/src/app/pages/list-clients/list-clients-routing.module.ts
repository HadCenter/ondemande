import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClientsComponent } from './list-clients.component';


const routes: Routes = [{
  path: '',
  component: ListClientsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListClientsRoutingModule { }
