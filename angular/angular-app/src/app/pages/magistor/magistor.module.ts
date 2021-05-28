import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MagistorRoutingModule } from './magistor-routing.module';
import { MagistorComponent } from './magistor.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@NgModule({
  declarations: [MagistorComponent,],
  imports: [
    CommonModule,
    MagistorRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class MagistorModule { }
