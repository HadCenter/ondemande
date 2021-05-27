import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MagistorRoutingModule } from './magistor-routing.module';
import { MagistorComponent } from './magistor.component';



@NgModule({
  declarations: [MagistorComponent,],
  imports: [
    CommonModule,
    MagistorRoutingModule
  ]
})
export class MagistorModule { }
