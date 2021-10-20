import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsKpiPowerbiComponent } from './details-kpi-powerbi.component';


const routes: Routes =[{
  path: '',
  component: DetailsKpiPowerbiComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailsKpiPowerbiRoutingModule { }
