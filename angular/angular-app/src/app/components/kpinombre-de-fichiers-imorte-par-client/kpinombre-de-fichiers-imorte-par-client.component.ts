import { Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { KPInombreDeFichiersImorteParClientService } from './kpinombre-de-fichiers-imorte-par-client.service';
import { MatDatepicker } from '@angular/material/datepicker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
/*************************************************************************************/
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY-MM-DD',
    dateA11yLabel: 'YYYY-MM-DD',
    monthYearA11yLabel: 'YYYY-MM-DD',
  },
};
/*************************************************************************************/
@Component({
  selector: 'app-kpinombre-de-fichiers-imorte-par-client',
  templateUrl: './kpinombre-de-fichiers-imorte-par-client.component.html',
//   styleUrls: ['./kpinombre-de-fichiers-imorte-par-client.component.css'],
  styleUrls: ['../../../theme/components/pie-chart/pie-chart.component.scss'],
  providers: [KPInombreDeFichiersImorteParClientService,{
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},],
})
/*************************************************************************************/
export class KPInombreDeFichiersImorteParClientComponent implements OnInit {
  @ViewChild('input') input: ElementRef;
  data = [];
  show = true;
  count = 0 ;
  selected = undefined;
/*************************************************************************************/
  constructor(public el: ElementRef,
    public serviceKPI : KPInombreDeFichiersImorteParClientService,) { }
/*************************************************************************************/
  public ngOnInit() {
    this.getData();
  }
/*************************************************************************************/
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
     this.onChangeClientOrDate();
  }
/*************************************************************************************/
  public getData() {
    this.serviceKPI.getNumberOfFilesPerClient()
      .subscribe(res => {
        this.data = res;
         this.data.forEach(element => this.count = this.count + element.files.length);
        this.show = false;
      },
        error => console.log(error));
  }
/*************************************************************************************/
  onChangeClient(ob) {
       this.selected = ob.value;
       this.onChangeClientOrDate();
  }
  onChangeClientOrDate()
  {
    if(this.selected !== undefined) // select single client
       {
          if(this.input.nativeElement.value === undefined) //pas de date selectionnée
          {
            var tableau = this.data.find(element => element.nom_client === this.selected).files;
            this.count = tableau.length;
          }else{
            this.count =0;
            let files = this.data.find(element => element.nom_client === this.selected).files;
            files.forEach(element => {
              if(element.created_at.includes(this.input.nativeElement.value)){this.count +=1}
            });
          }
       }else //select all
       {
          if(this.input.nativeElement.value === undefined) //pas de date selectionnée
          {
            this.count = 0;
            this.data.forEach(element => this.count = this.count + element.files.length);
          }else //date selectionnée
          {
            this.count =0;
            let files = [];
            this.data.forEach(element => {if(element.files.length !==0) {element.files.forEach(file => files.push(file))}})
            files.forEach(element => {
              if(element.created_at.includes(this.input.nativeElement.value)){this.count +=1}
            });
          }
       }
  }
/*************************************************************************************/
}
