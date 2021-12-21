import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsFileMagistorRoutingModule } from './details-file-magistor-routing.module';
import { DetailsFileMagistorComponent } from './details-file-magistor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { ThemeModule } from 'theme/theme.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderModule } from 'app/components/loader/loader.module';
import { PrestationErroneeModule } from '../prestation-erronee/prestation-erronee.module';
import { MagistorService } from '../magistor.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DetailsFileMagistorComponent, ConfirmDialogComponent],
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule, ReactiveFormsModule,
    DetailsFileMagistorRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatExpansionModule,
    LoaderModule,
    PrestationErroneeModule,
    MatDialogModule,
    MatButtonModule,

    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,

  ],
  providers: [
    MagistorService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
  entryComponents: [ConfirmDialogComponent]


})
export class DetailsFileMagistorModule { }
