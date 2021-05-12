import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsFileEdiRoutingModule } from './details-file-edi-routing.module';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsFileEdiService } from './details-file-edi.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DetailsFileEdiComponent } from './details-file-edi.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [DetailsFileEdiComponent],
  imports: [
    CommonModule,
    DetailsFileEdiRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule,
    LoaderModule,
    MatSnackBarModule,
    MatTableModule,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    DetailsFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class DetailsFileEdiModule { }
