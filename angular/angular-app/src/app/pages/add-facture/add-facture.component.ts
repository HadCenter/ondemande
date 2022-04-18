import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { List } from 'postcss/lib/list';
import { FacturationPreparationService } from '../facturation-preparation/facturation-preparation.service';
import { AddFactureService } from './add-facture.service';

@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.scss']
})
export class AddFactureComponent implements OnInit {
  public advancedHeaders = this.service.getAdvancedHeaders();
  public monthDays: any;
  public nextMonth: any;
  JourPreparations: any = [];
  NuitPreparations: any = [];
  ProvincePreparations: any = [];
  client_name: string = "";
  mois: string;
  existingFacturation: any;
  constructor(private service: AddFactureService,
    private facturationService: FacturationPreparationService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.get_days_list();

  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  get_days_list() {
    this.monthDays = [];
    var date = new Date();
    this.nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.mois = this.datePipe.transform(new Date(date.getFullYear(), date.getMonth() + 1, 1), 'MM-yyyy');
    this.client_name = this.facturationService.getClient();
    var data = {
      "code_client": "C081",
      "mois": this.mois
    }
    this.facturationService.getFacturationForClients(data).subscribe(res => {
      this.existingFacturation = res;
      for (let i = 1; i <= this.daysInMonth(date.getMonth() + 1, date.getFullYear()); i++) {
        var monthDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
        this.monthDays.push(monthDate);
        this.existingFacturation.forEach(element => {
          if (Date.parse(element.date) == Date.parse(monthDate.toDateString())) {
            this.JourPreparations.push(element.prep_jour);
            this.NuitPreparations.push(element.prep_nuit);
            this.ProvincePreparations.push(element.prep_province);
          }
        });
      }
    },
      err => { })



  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  getExistingFacturation() {
    var data = {
      "code_client": "C081",
      // "mois": this.mois
      "mois": "04-2022"
    }
    this.facturationService.getFacturationForClients(data).subscribe(res => {
      this.existingFacturation = res;
      console.log(this.existingFacturation);
    },
      err => { })
  }

  insertFacturation() {
    let preparations: any = [];
    var data = {
      code_client: "C081",
      date: "",
      prep_jour: "",
      prep_nuit: ""
    }

    this.monthDays.forEach(element => {
      //console.log(this.datePipe.transform(element, 'yyyy-MM-dd'));
    });

    console.log(this.monthDays[0]);

    for (var i = 0; i < this.monthDays.length; i++) {
      data.date = this.datePipe.transform(this.monthDays[i], 'yyyy-MM-dd');
      console.log(data.date);
      data.prep_jour = this.JourPreparations[i].toString();
      data.prep_nuit = this.NuitPreparations[i].toString();
      console.log(data);
      preparations.push(data);
    }
    //console.log({preparations: preparations});
    console.log(preparations);

  }

}

