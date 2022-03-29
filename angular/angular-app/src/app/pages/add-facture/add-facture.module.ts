import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AddFactureRoutingModule } from './add-facture-routing.module';
import { AddFactureComponent } from './add-facture.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ThemeModule } from 'theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// the second parameter 'fr' is optional
registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AddFactureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    ThemeModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    AddFactureRoutingModule,
    MatSnackBarModule
  ],
  providers: [
    DatePipe,
    {provide: LOCALE_ID, useValue: 'fr' }
  ]
})
export class AddFactureModule { }
