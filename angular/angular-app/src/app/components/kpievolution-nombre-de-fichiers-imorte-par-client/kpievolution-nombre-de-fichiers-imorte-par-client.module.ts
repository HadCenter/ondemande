import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIEvolutionNombreDeFichiersImorteParClientComponent } from './kpievolution-nombre-de-fichiers-imorte-par-client.component';
import { KPIEvolutionNombreDeFichiersImorteParClientService } from './kpievolution-nombre-de-fichiers-imorte-par-client.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';



@NgModule({
  declarations: [KPIEvolutionNombreDeFichiersImorteParClientComponent],
  imports: [
    CommonModule
  ],
   providers: [
    KPIEvolutionNombreDeFichiersImorteParClientService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class KPIEvolutionNombreDeFichiersImorteParClientModule { }
