import * as d3 from 'd3';
import * as nv from 'nvd3';

import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';

import { PieChartComponent as BasePieChartComponent } from 'theme/components/pie-chart';

import { BrowserStatisticsChartService } from './browser-statistics-chart.service';

@Component({
  selector: 'app-browser-statistics-chart',
  styleUrls: ['../../../theme/components/pie-chart/pie-chart.component.scss'],
  template: `<div id="conteneur" >
  <app-loader [width]="'100%'" [position]="'sticky'"  [height]="'100px'" [bg]="'transparant'" [show]="show"></app-loader>
        <div *ngIf = "data.length > 0">
          <h4>Choisir un client </h4>
          <mat-form-field appearance="fill" >
            <mat-label>Client</mat-label>
            <mat-select [(value)]="selected">
              <mat-option *ngFor="let object of data" [value]="object.label">
                {{object.label}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div *ngIf = "data.length > 0">
          <h4 >Nombre de fichiers importés : </h4>
          <h4  > {{get(selected)}}</h4>
        </div></div>
  `,
  providers: [BrowserStatisticsChartService],
})
export class BrowserStatisticsChartComponent implements OnInit {
  data =[];
  show = true;
  selected = "";
  constructor(
    public el: ElementRef,
    public browserStatisticsChartService: BrowserStatisticsChartService,
  ) {

  }
  public ngOnInit() {
    this.getData();
  }
   public getData() {
    this.browserStatisticsChartService.getNumberOfFilesPerClient()
      .subscribe(res => {
        this.data = res;
        this.selected = this.data[0].label;
        this.show = false;
      },
        error => console.log(error));
    }
    public get()
    {
      return this.data.find(element => element.label === this.selected).value;
    }


}
