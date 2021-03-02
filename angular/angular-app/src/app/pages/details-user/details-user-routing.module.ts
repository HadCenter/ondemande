import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsUserComponent } from './details-user.component';


const routes: Routes = [{
  path: '',
  component: DetailsUserComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsUserRoutingModule { }
