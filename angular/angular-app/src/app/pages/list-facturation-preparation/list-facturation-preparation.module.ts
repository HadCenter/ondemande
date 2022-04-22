import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFacturationPreparationRoutingModule } from './list-facturation-preparation-routing.module';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ListFacturationPreparationComponent } from './list-facturation-preparation.component';
import { LoaderModule } from 'app/components/loader/loader.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ListClientsService } from '../list-clients/list-clients.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogAddClientComponent } from './dialog-add-client/dialog-add-client.component';
import { MatInputModule } from '@angular/material/input';
import { ConfigCritereService } from '../config-critere/config-critere.service';

@NgModule({
  declarations: [
    ListFacturationPreparationComponent,
    DialogAddClientComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    ThemeModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    ListFacturationPreparationRoutingModule
  ],
  providers: [
    ListClientsService,
    ConfigCritereService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListFacturationPreparationModule { }
