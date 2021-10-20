import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PowerbiEmbeddedComponent } from './powerbi-embedded.component';


const routes: Routes =[{
  path: '',
  component: PowerbiEmbeddedComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PowerbiEmbeddedRoutingModule { }
