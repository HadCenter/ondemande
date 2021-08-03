import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsFileMagistorRoutingModule } from './details-file-magistor-routing.module';
import { DetailsFileMagistorComponent } from './details-file-magistor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { ThemeModule } from 'theme/theme.module';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [DetailsFileMagistorComponent],
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule, ReactiveFormsModule,
    DetailsFileMagistorRoutingModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    
  ]
})
export class DetailsFileMagistorModule { }
