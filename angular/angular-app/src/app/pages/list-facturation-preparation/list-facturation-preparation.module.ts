import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFacturationPreparationRoutingModule } from './list-facturation-preparation-routing.module';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ListFacturationPreparationComponent } from './list-facturation-preparation.component';
// import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    ListFacturationPreparationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    // MatCardModule,
    ReactiveFormsModule,
    ThemeModule,
    MatFormFieldModule,
    ListFacturationPreparationRoutingModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListFacturationPreparationModule { }