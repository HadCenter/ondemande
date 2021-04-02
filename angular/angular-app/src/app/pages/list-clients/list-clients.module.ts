import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListClientsRoutingModule } from './list-clients-routing.module';
import { DetailsClientComponent, ListClientsComponent } from './list-clients.component';
import { ListClientsService } from './list-clients.service';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { DialogBodyComponent } from '../../components/dialog-body/dialog-body.component';
import { CreateClientService } from './dialog/create-client.service';
import { LoaderModule } from 'app/components/loader/loader.module';
import { DetailsClientService } from './details-client/details-client.service';







@NgModule({
  declarations: [ListClientsComponent, DetailsClientComponent, DialogBodyComponent],
  imports: [
    CommonModule,
    ListClientsRoutingModule,
    ThemeModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    MatGridListModule,
    LoaderModule,
  ],
  entryComponents: [DialogBodyComponent, DetailsClientComponent],
  providers: [
    ListClientsService,
    CreateClientService,
    DetailsClientService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListClientsModule { }
