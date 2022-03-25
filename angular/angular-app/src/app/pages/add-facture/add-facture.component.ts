import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public code_client: any;
  JourPreparations: any = [];
  NuitPreparations: any = [];
  ProvincePreparations: any = [];
  client_name: string = "";
  mois: string;
  existingFacturation: any;
  constructor(private service: AddFactureService,
    private facturationService: FacturationPreparationService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.code_client = this.route.snapshot.params.client
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
      "code_client": this.code_client,
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


  insertFacturation() {
    let preparations: any = [];
    let data = {
      code_client: "C081",
      date: "",
      prep_jour: "",
      prep_nuit: ""
    }

    for (var i = 0; i < this.JourPreparations.length; i++) {
      data.date = this.datePipe.transform(this.monthDays[i], 'yyyy-MM-dd');
      data.prep_jour = this.JourPreparations[i].toString();
      data.prep_nuit = this.NuitPreparations[i].toString();
      preparations.push(
        {
          code_client: "C081",
          date: data.date,
          prep_jour: data.prep_jour,
          prep_nuit: data.prep_nuit
        }
      );
    }
    console.log({preparations: preparations});
    this.service.addFacturation({preparations: preparations}).subscribe(res =>{
      this.monthDays = [];
      this.JourPreparations = [];
      this.NuitPreparations = [];
      this.ProvincePreparations = [];
    
      this.get_days_list();

    })
  }

  randomize(){
    for (var i = this.JourPreparations.length; i < this.monthDays.length; i++) {
      var min =1;
      var max = 11;
      this.JourPreparations[i] = Math.floor(Math.random() * (max - min + 1) + min);

      this.NuitPreparations[i] = Math.floor(Math.random() * (max - min + 1) + min);

    }
  }

}

