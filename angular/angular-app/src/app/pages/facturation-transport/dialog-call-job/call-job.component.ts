import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';
import { FacturationTransportService } from '../facturation-transport.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-call-job',
  templateUrl: './call-job.component.html',
  styleUrls: ['./call-job.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CallJobComponent implements OnInit {
  public facture:any;
  myForm: FormGroup;
  numFacture: string = "0";
  submitClicked: boolean = false;

  constructor(    public dialogRef: MatDialogRef<CallJobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  private service: FacturationTransportService) { }
  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }
  ngOnInit(): void {
    console.log(this.data)
    this.myForm = new FormGroup({
      numFacture: new FormControl(),
      date: new FormControl(moment())
    })
  }


  onSubmit() {
    this.submitClicked = true;
    var data = {
      plan:this.data.plan,
      date: this.date.value.format('MM-YYYY'),
      numFacture: this.myForm.value.numFacture
    }
    this.service.launchPlan(data).subscribe(res => {
      this.dialogRef.close('submit');
    },
    err => {

    })    

  }

}
