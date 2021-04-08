import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTransactionRoutingModule } from './list-transaction-routing.module';
import { ListTransactionComponent } from './list-transaction.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@NgModule({
  declarations: [ListTransactionComponent],
  imports: [
    CommonModule,
    ListTransactionRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    
    
    
  ]
})
export class ListTransactionModule { }
