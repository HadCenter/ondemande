import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportFileEdiRoutingModule } from './import-file-edi-routing.module';
import { ImportFileEdiComponent } from './import-file-edi.component';
import { ImportFileEdiService } from './import-file-edi.service';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [ImportFileEdiComponent,LoaderComponent,],
  imports: [
    CommonModule,
    ImportFileEdiRoutingModule,
    ThemeModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatNativeDateModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule

  ],
  providers: [
    ImportFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ImportFileEdiModule { }
