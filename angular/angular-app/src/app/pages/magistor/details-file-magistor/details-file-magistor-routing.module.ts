import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsFileMagistorComponent } from './details-file-magistor.component';


const routes: Routes = [{
  path: '',
  component: DetailsFileMagistorComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsFileMagistorRoutingModule { }
