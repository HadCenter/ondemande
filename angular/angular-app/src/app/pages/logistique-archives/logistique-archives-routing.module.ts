import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LogistiqueArchivesComponent } from './logistique-archives.component';

const routes: Routes = [{
  path: '',
  component: LogistiqueArchivesComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogistiqueArchivesRoutingModule { }

