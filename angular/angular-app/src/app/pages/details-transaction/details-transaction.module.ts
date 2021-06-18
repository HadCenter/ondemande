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
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [DetailsTransactionComponent],
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
  ],
  providers: [
    DetailsTransactionService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class DetailsTransactionModule { }
