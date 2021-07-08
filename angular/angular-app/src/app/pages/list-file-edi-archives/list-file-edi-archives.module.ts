import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFileEdiArchivesRoutingModule } from './list-file-edi-archives-routing.module';
import { ListFileEdiArchivesComponent } from './list-file-edi-archives.component';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ListFileEdiArchivesService } from './list-file-edi-archives.service';

//Material Table Modules
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MyCustomPaginatorIntl} from './paginator-frensh';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  declarations: [ListFileEdiArchivesComponent,],
  imports: [
    CommonModule,
    ListFileEdiArchivesRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
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
    LoaderModule,
    FormsModule, ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  providers: [
    ListFileEdiArchivesService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}
  ],
})
export class ListFileEdiArchivesModule { }
