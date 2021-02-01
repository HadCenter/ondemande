import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListClientsRoutingModule } from './list-clients-routing.module';
import { ListClientsComponent } from './list-clients.component';
import { ListClientsService } from './list-clients.service';
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


@NgModule({
  declarations: [ListClientsComponent],
  imports: [
    CommonModule,
    ListClientsRoutingModule,
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
    ListClientsService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListClientsModule { }
