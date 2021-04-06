import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { ThemeModule } from 'theme';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { BrowserStatisticsChartComponent } from 'app/components/browser-statistics-chart';
import {MatSelectModule} from '@angular/material/select';
import { LoaderModule } from 'app/components/loader/loader.module';
import { KPInombreDeFichiersImorteParClientComponent } from 'app/components/kpinombre-de-fichiers-imorte-par-client';
import { KPIEvolutionNombreDeFichiersImorteParClientComponent } from 'app/components/kpievolution-nombre-de-fichiers-imorte-par-client';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  declarations: [BrowserStatisticsChartComponent, KPInombreDeFichiersImorteParClientComponent, KPIEvolutionNombreDeFichiersImorteParClientComponent,HomeComponent, ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ThemeModule,
    MatSelectModule,
    LoaderModule,
    MatDatepickerModule,
    MatInputModule,
    MatMomentDateModule,
    HighchartsChartModule
  ],
  providers: [
    HomeService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class HomeModule { }
