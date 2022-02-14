import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { DialogCreateUser, DialogDetailsUser, UsersComponent } from './users.component';
import { UsersService } from './users.service';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { CreateUserService } from './dialog/create-user.service';
import { LoaderModule } from 'app/components/loader/loader.module';
import { DetailsUserService } from './dialog-details-user/details-user.service';
import { PowerbiEmbeddedService } from '../powerbi-embedded/powerbi-embedded.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';




@NgModule({
  declarations: [UsersComponent,DialogCreateUser,DialogDetailsUser],
  entryComponents: [DialogCreateUser,DialogDetailsUser],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
    MatAutocompleteModule
  ],
  providers: [
    UsersService,
    CreateUserService,
    DetailsUserService,
    PowerbiEmbeddedService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class UsersModule { }
