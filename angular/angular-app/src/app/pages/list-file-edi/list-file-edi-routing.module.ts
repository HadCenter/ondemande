import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFileEDIComponent } from './list-file-edi.component';


const routes: Routes = [{
  path: '',
  component: ListFileEDIComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFileEdiRoutingModule { }
