import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { ThemeModule } from 'theme';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserStatisticsChartComponent } from 'app/components/browser-statistics-chart';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoaderModule } from 'app/components/loader/loader.module';
import { KPInombreDeFichiersImorteParClientComponent } from 'app/components/kpinombre-de-fichiers-imorte-par-client/kpinombre-de-fichiers-imorte-par-client.component';
import { KPIEvolutionNombreDeFichiersImorteParClientComponent } from 'app/components/kpievolution-nombre-de-fichiers-imorte-par-client/kpievolution-nombre-de-fichiers-imorte-par-client.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HighchartsChartModule } from 'highcharts-angular';
import { KpiAnomaliesComponent } from 'app/components/kpi-anomalies/kpi-anomalies.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { KpiInterventionAdminComponent } from 'app/components/kpi-intervention-admin/kpi-intervention-admin.component';

import { MAT_DATE_LOCALE } from '@angular/material/core'


@NgModule({
  declarations: [BrowserStatisticsChartComponent, KPInombreDeFichiersImorteParClientComponent, KPIEvolutionNombreDeFichiersImorteParClientComponent,HomeComponent,KpiAnomaliesComponent, KpiInterventionAdminComponent ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ThemeModule,
    MatSelectModule,
    LoaderModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    HighchartsChartModule,
    FormsModule, ReactiveFormsModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  providers: [
    HomeService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' },
   },
  ],
})
export class HomeModule { }
