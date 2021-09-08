import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ListFileEdiArchivesComponent } from './list-file-edi-archives.component';

const routes: Routes = [{
  path: '',
  component: ListFileEdiArchivesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFileEdiArchivesRoutingModule { }


