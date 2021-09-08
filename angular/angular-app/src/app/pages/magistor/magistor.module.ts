import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MagistorRoutingModule } from './magistor-routing.module';
import {  DialogImportFile, MagistorComponent } from './magistor.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
import { MagistorService } from './magistor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { LoaderModule } from 'app/components/loader/loader.module';



@NgModule({
  declarations: [MagistorComponent, DialogImportFile,],
  imports: [
    CommonModule,
    MagistorRoutingModule,
    ThemeModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    FormsModule, ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    LoaderModule,
  ],
  entryComponents: [
    DialogImportFile,
  ],
  providers: [
    MagistorService,
    ImportFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class MagistorModule { }
