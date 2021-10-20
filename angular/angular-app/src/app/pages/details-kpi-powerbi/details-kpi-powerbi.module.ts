import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsKpiPowerbiRoutingModule } from './details-kpi-powerbi-routing.module';
import { DetailsKpiPowerbiComponent } from './details-kpi-powerbi.component';
import { NgxPowerBiModule } from 'ngx-powerbi';


@NgModule({
  declarations: [DetailsKpiPowerbiComponent],
  imports: [
    CommonModule,
    DetailsKpiPowerbiRoutingModule,
    NgxPowerBiModule
  ]
})
export class DetailsKpiPowerbiModule { }
