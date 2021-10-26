import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionRoutingModule } from './list-transaction-routing.module';
import { DailogGenerateTransaction, ListTransactionComponent } from './list-transaction.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ListTransactionService } from './list-transaction.service';
import { GenererTransactionService } from './dialog/generer-transaction.service';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatIconModule } from '@angular/material/icon';
import { Mypipe } from './mypipe';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  declarations: [ListTransactionComponent, DailogGenerateTransaction, Mypipe],
  imports: [
    CommonModule,
    ListTransactionRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    MatIconModule,
    MatSnackBarModule,

  ],
  entryComponents: [
    DailogGenerateTransaction,
  ],
  providers: [
    ListTransactionService,
    GenererTransactionService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ],
})
export class ListTransactionModule { }
