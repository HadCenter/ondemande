import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsFactureRoutingModule } from './details-facture-routing.module';
import { DetailsFactureComponent } from './details-facture.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ThemeModule } from 'theme';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    DetailsFactureComponent
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
    DetailsFactureRoutingModule
  ]
})
export class DetailsFactureModule { }
