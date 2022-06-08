import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacturationTransportRoutingModule } from './facturation-transport-routing.module';
import { FacturationTransportComponent } from './facturation-transport.component';
import { ListBillingComponent } from './list-billing/list-billing.component';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StatusJobsComponent } from './status-jobs/status-jobs.component';
import { ModifyFactureComponent } from './dialog-modify-facture/modify-facture.component';
import { CallJobComponent } from './dialog-call-job/call-job.component';
import { MatInputModule } from '@angular/material/input';




@NgModule({
  declarations: [
    FacturationTransportComponent,
    ListBillingComponent,
    StatusJobsComponent,
    ModifyFactureComponent,
    CallJobComponent,
  ],
  imports: [
    CommonModule,
    FacturationTransportRoutingModule,
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
    MatInputModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class FacturationTransportModule { }
