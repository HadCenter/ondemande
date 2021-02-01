import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListOrdersRoutingModule } from './list-orders-routing.module';
import { ListOrdersComponent, DialogOverviewExampleDialog } from './list-orders.component';
import { ListOrderService } from './list-orders.service';
import { PieChartService } from '../../components/pie-chart/pie-chart.service';
import { DiscreteBarChartService } from '../../components/discrete-bar-chart/discrete-bar-chart.service';

import { ThemeModule } from 'theme';
import { PieChartComponent } from '../../components/pie-chart';
import { DiscreteBarChartComponent } from '../../components/discrete-bar-chart';

import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [ListOrdersComponent, PieChartComponent, DialogOverviewExampleDialog,DiscreteBarChartComponent],
  imports: [
    CommonModule,
    ListOrdersRoutingModule,
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
   
  ],
  entryComponents: [DialogOverviewExampleDialog],
  providers: [
    ListOrderService,
    PieChartService,
    DiscreteBarChartService,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ],
})
export class ListOrdersModule { }
