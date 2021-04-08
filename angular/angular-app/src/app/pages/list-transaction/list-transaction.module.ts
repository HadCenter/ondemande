import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListTransactionRoutingModule } from './list-transaction-routing.module';
import { DailogGenerateTransaction, ListTransactionComponent } from './list-transaction.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
@NgModule({
  declarations: [ListTransactionComponent,DailogGenerateTransaction],
  imports: [
    CommonModule,
    ListTransactionRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule
    
    
  ],
  entryComponents: [
    DailogGenerateTransaction,
  ],
})
export class ListTransactionModule { }
