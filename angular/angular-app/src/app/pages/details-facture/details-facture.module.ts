import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { DetailsFactureRoutingModule } from './details-facture-routing.module';
import { DetailsFactureComponent } from './details-facture.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';
import { ThemeModule } from 'theme';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    DetailsFactureComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoaderModule,
    ReactiveFormsModule,
    ThemeModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    DetailsFactureRoutingModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'fr' }
  ],
})
export class DetailsFactureModule { }
