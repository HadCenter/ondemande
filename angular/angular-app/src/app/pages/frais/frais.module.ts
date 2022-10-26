import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fraisRoutingModule } from './frais-routing.module';
import { DialogCreateUser, DialogDetailsFrais, fraisComponent } from './frais.component';
import { fraisService } from './frais.service';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateFraisService } from './dialog/create-frais.service';
import { LoaderModule } from 'app/components/loader/loader.module';
import { DetailsUserService } from './dialog-details-frais/details-frais.service';
import { PowerbiEmbeddedService } from '../powerbi-embedded/powerbi-embedded.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';





@NgModule({
  declarations: [fraisComponent,DialogCreateUser,DialogDetailsFrais],
  entryComponents: [DialogCreateUser,DialogDetailsFrais],
  imports: [
    CommonModule,
    fraisRoutingModule,
    ThemeModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    LoaderModule,
    MatAutocompleteModule,
  ],
  providers: [
    fraisService,
    CreateFraisService,
    DetailsUserService,
    PowerbiEmbeddedService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class fraisModule { }
