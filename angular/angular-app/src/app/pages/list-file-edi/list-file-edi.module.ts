import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListFileEdiRoutingModule } from './list-file-edi-routing.module';
import { ListFileEDIComponent } from './list-file-edi.component';
import { ListFileEdiService } from './list-file-edi.service';
import { ThemeModule } from 'theme';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [ListFileEDIComponent,LoaderComponent,],
  imports: [
    CommonModule,
    ListFileEdiRoutingModule,
    ThemeModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  providers: [
    ListFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListFileEdiModule { }
