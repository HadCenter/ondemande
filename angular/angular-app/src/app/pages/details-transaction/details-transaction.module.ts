import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DetailsTransactionRoutingModule } from './details-transaction-routing.module';
import { DetailsTransactionComponent } from './details-transaction.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [DetailsTransactionComponent],
  imports: [
    CommonModule,
    DetailsTransactionRoutingModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSnackBarModule,
  ]
})
export class DetailsTransactionModule { }
