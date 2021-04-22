import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListClientsRoutingModule } from './list-clients-routing.module';
import { DetailsClientComponent, ListClientsComponent, TokenClientComponent } from './list-clients.component';
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
import { TokenClientService } from './token-client/token-client.service';

@NgModule({
  declarations: [ListClientsComponent, DetailsClientComponent, DialogBodyComponent, TokenClientComponent],
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
  entryComponents: [DialogBodyComponent, DetailsClientComponent, TokenClientComponent],
  providers: [
    ListClientsService,
    CreateClientService,
    DetailsClientService,
    TokenClientService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListClientsModule { }
