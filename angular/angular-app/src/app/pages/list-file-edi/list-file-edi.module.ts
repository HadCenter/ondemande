import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFileEdiRoutingModule } from './list-file-edi-routing.module';
import { DialogImportFile, ListFileEDIComponent } from './list-file-edi.component';
import { ListFileEdiService } from './list-file-edi.service';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from '../../components/loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
@NgModule({
  declarations: [ListFileEDIComponent, LoaderComponent,DialogImportFile,],
  imports: [
    CommonModule,
    ListFileEdiRoutingModule,
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
    FormsModule, ReactiveFormsModule
  ],

  entryComponents: [
    DialogImportFile,
  ],
  providers: [
    ListFileEdiService,
    ImportFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListFileEdiModule { }
