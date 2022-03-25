import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FacturationPreparationRoutingModule } from './facturation-preparation-routing.module';
import { FacturationPreparationComponent } from './facturation-preparation.component';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ThemeModule } from 'theme';
import { DialogDetailsFacturationComponent } from './dialog-details-facturation/dialog-details-facturation.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    FacturationPreparationComponent,
    DialogDetailsFacturationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    ThemeModule,
    MatFormFieldModule,
    MatDialogModule,
    FacturationPreparationRoutingModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],

})
export class FacturationPreparationModule { }
