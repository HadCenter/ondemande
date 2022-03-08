import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailsTransactionRoutingModule } from './details-transaction-routing.module';
import { DetailsTransactionComponent } from './details-transaction.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DetailsTransactionService } from './details-transaction.service';
import { MatTableModule } from '@angular/material/table';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import {MyCustomPaginatorIntl} from './paginator-frensh';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectClientDialogComponent } from './select-client-dialog/select-client-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [DetailsTransactionComponent, SelectClientDialogComponent],
  imports: [
    CommonModule,
    DetailsTransactionRoutingModule,
    ThemeModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTableModule,
    LoaderModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatListModule
  ],
  providers: [
    DetailsTransactionService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MatPaginatorIntl, useClass: MyCustomPaginatorIntl}
  ],
  entryComponents: [SelectClientDialogComponent]
})
export class DetailsTransactionModule { }
