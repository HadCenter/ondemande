import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrestationErroneeRoutingModule } from './prestation-erronee-routing.module';
import { PrestationErroneeComponent } from './prestation-erronee.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PrestationErroneeComponent],
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule, ReactiveFormsModule,
    PrestationErroneeRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatExpansionModule,
    LoaderModule

  ],
  exports:[PrestationErroneeComponent]
})
export class PrestationErroneeModule { }
