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
import { ListTransactionService } from './list-transaction.service';
import { GenererTransactionService } from './dialog/generer-transaction.service';
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
  providers: [
    ListTransactionService,
    GenererTransactionService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListTransactionModule { }
