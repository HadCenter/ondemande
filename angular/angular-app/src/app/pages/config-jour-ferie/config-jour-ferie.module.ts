import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigJourFerieRoutingModule } from './config-jour-ferie-routing.module';
import { ConfigJourFerieComponent } from './config-jour-ferie.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    ConfigJourFerieComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ConfigJourFerieRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatListModule,
    MatCheckboxModule,
    LoaderModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' },
   },
  ],

})
export class ConfigJourFerieModule { }
