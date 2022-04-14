import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigJourFerieComponent } from './config-jour-ferie.component';

const routes: Routes = [{
  path: '',
  component: ConfigJourFerieComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigJourFerieRoutingModule { }
