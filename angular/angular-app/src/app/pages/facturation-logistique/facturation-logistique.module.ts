import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturationLogistiqueRoutingModule } from './facturation-logistique-routing.module';
import { FacturationLogistiqueComponent } from './facturation-logistique.component';


@NgModule({
  declarations: [FacturationLogistiqueComponent],
  imports: [
    CommonModule,
    FacturationLogistiqueRoutingModule
  ]
})
export class FacturationLogistiqueModule { }
