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

@NgModule({
  declarations: [DetailsFileEdiComponent],
  imports: [
    CommonModule,
    DetailsFileEdiRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatInputModule
  ],
  providers: [
    DetailsFileEdiService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class DetailsFileEdiModule { }
