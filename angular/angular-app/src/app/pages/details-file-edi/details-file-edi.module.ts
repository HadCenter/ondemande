import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailsFileEdiRoutingModule } from './details-file-edi-routing.module';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DetailsFileEdiRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DetailsFileEdiModule { }
