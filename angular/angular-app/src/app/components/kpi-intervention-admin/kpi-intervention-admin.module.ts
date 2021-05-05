import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiInterventionAdminComponent } from './kpi-intervention-admin.component';
import { KpiInterventionAdminService } from './kpi-intervention-admin.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';



@NgModule({
  declarations: [KpiInterventionAdminComponent],
  imports: [
    CommonModule
  ],
   providers: [
    KpiInterventionAdminService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class KpiInterventionAdminModule { }
