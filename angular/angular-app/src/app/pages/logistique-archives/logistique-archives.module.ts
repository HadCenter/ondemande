import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogistiqueArchivesRoutingModule } from './logistique-archives-routing.module';
import { LogistiqueArchivesComponent } from './logistique-archives.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';


@NgModule({
  declarations: [LogistiqueArchivesComponent,],
  imports: [
    CommonModule,
    LogistiqueArchivesRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class LogistiqueArchivesModule { }
