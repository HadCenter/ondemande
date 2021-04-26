import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiAnomaliesComponent } from './kpi-anomalies.component';
import { KpiAnomaliesService } from './kpi-anomalies.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';



@NgModule({
  declarations: [KpiAnomaliesComponent],
  imports: [
    CommonModule
  ],
   providers: [
    KpiAnomaliesService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class KpiAnomaliesModule { }
