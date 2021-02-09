import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsClientComponent } from './details-client.component';


const routes: Routes = [{
  path: '',
  component: DetailsClientComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsClientRoutingModule { }
