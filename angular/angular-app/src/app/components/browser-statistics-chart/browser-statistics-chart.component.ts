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
          <h5>Choisir un client </h5>
          <mat-form-field appearance="fill" >
            <mat-label>Client</mat-label>
            <mat-select [(value)]="selected" (selectionChange)="onBookChange($event)">
              <mat-option>Tous</mat-option>
              <mat-option *ngFor="let object of data" [value]="object.nom_client">
                {{object.nom_client}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div *ngIf = "data.length > 0">
          <h5>Choisir une date </h5>
          <mat-form-field appearance="fill" >
            <mat-label>Date</mat-label>
            <mat-select [(value)]="selectedDate" (selectionChange)="onDataChange($event)">
              <mat-option>Tous</mat-option>
              <mat-option *ngFor="let object of data2" [value]="object">
                {{object | date:"yyyy/MM/dd" }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div *ngIf = "data.length > 0">
          <h5 >Nombre de fichiers importés : </h5>
          <div class="centrage"><h4> {{count}}</h4></div>
        </div>
        </div>
  `,
  providers: [BrowserStatisticsChartService],
})
export class BrowserStatisticsChartComponent implements OnInit {
  data =[];
  data2=[];
  show = true;
  count = 0 ;
  selected = '';
  selectedDate = '';
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
         this.data.forEach(element => this.count = this.count + element.files.length);
        this.show = false;
      },
        error => console.log(error));
    }
    onBookChange(ob) {
       this.selected = ob.value;
       if(this.selected !== undefined)
       {
          this.selectedDate = undefined;
          this.data2 = [];
          var tableau = this.data.find(element => element.nom_client === this.selected).files;
          this.data2 = [...new Set(tableau.map(item => item.created_at.substring(0,10)))];
          this.count = tableau.length;
       }else{
          this.data2 = [];
          this.count =0;
          this.data.forEach(element => this.count = this.count + element.files.length);
       }
    }
    onDataChange(ob) {
        this.selectedDate = ob.value;
        if (ob.value !== undefined )
        {
            this.count =0;
            let files = this.data.find(element => element.nom_client === this.selected).files;
            files.forEach(element => {
              if(element.created_at.includes(this.selectedDate.substring(0,10))){this.count +=1}
            });
        }else{
          if(this.selected !== '' && this.selected !== undefined)
          {
            this.count = this.data.find(element => element.nom_client === this.selected).files.length;
          }else{
            this.count = 0;
            this.data.forEach(element => this.count = this.count + element.files.length);
          }
        }
    }
}
