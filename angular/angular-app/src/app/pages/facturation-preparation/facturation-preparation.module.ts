import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { FacturationPreparationRoutingModule } from './facturation-preparation-routing.module';
import { FacturationPreparationComponent } from './facturation-preparation.component';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ThemeModule } from 'theme';
import { DialogDetailsFacturationComponent } from './dialog-details-facturation/dialog-details-facturation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

registerLocaleData(localeFr);

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
    MatSnackBarModule,
    FacturationPreparationRoutingModule
  ],
  providers: [
    DatePipe,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    {provide: LOCALE_ID, useValue: 'fr' }

  ],

})
export class FacturationPreparationModule { }
