import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  public monthDays: any = [];
  public monthInLetters: any;
  public code_client: any;
  JourPreparations: any = [];
  NuitPreparations: any = [];
  ProvincePreparations: any = [];
  UM_jour: any = [];
  UM_nuit: any = [];
  UM_province: any = [];
  client_name: string = "";
  mois: string;
  existingFacturation: any;
  monthNumber: number;
  yearNumber: number;

  constructor(private service: AddFactureService,
    private facturationService: FacturationPreparationService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.code_client = this.route.snapshot.params.client;
    var monthAndYear = this.route.snapshot.params.date;

    this.monthNumber = parseInt(monthAndYear.split('-')[0]) - 1;
    this.yearNumber = parseInt(monthAndYear.split('-')[1]);

    if (this.redirectIfNotCurrentOrNextMonth()) {
      this.get_days_list();
    }
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  redirectIfNotCurrentOrNextMonth() {
    var date = new Date();
    //check if the same year or not
    if (this.yearNumber != date.getFullYear()) {
      this.router.navigate(['/liste-facturation-preparation', this.code_client]);
      return false;
    }

    if (this.monthNumber != date.getMonth() && this.monthNumber != date.getMonth() + 1) {
      this.router.navigate(['/liste-facturation-preparation', this.code_client]);
      return false;
    }
    return true;
  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  get_days_list() {
    this.monthInLetters = new Date(this.yearNumber, this.monthNumber, 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.mois = this.datePipe.transform(new Date(this.yearNumber, this.monthNumber, 1), 'MM-yyyy');
    var totalDaysInMonth = this.daysInMonth(this.monthNumber, this.yearNumber);
    this.client_name = this.facturationService.getClient();

    var data = {
      "code_client": this.code_client,
      "mois": this.mois
    }
    this.facturationService.getFacturationForClients(data).subscribe(res => {
      this.existingFacturation = res;
      for (let i = 1; i <= totalDaysInMonth; i++) {
        var monthDate = new Date(this.yearNumber, this.monthNumber, i);
        this.monthDays.push(monthDate);
        this.existingFacturation.forEach(element => {
          if (Date.parse(element.date) == Date.parse(monthDate.toDateString())) {
            this.JourPreparations.push(element.prep_jour);
            this.NuitPreparations.push(element.prep_nuit);
            this.ProvincePreparations.push(element.prep_province);
            this.UM_jour.push(element.UM_jour);
            this.UM_nuit.push(element.UM_nuit);
            this.UM_province.push(element.UM_province);
          }
        });
      }
    },
      err => { this.openSnackBar("Une erreur est survenue", "Ok", 4000); }
    )
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
    this.openSnackBar("Le calcul de la facturation est en cours, veuillez patienter", "Ok", 5000);

    let max_prep = Math.max(this.JourPreparations.length, this.NuitPreparations.length, this.ProvincePreparations.length)
    for (var i = 0; i < max_prep; i++) {
      let data = {
        code_client: this.code_client,
        date: "",
        prep_jour: undefined,
        UM_jour: undefined,
        prep_nuit: undefined,
        UM_nuit: undefined,
        prep_province: undefined,
        UM_province: undefined
      }
      data.date = this.datePipe.transform(this.monthDays[i], 'yyyy-MM-dd');
      if (this.JourPreparations[i]) {
        data.prep_jour = this.JourPreparations[i].toString();
      }
      if (this.NuitPreparations[i]) {
        data.prep_nuit = this.NuitPreparations[i].toString();
      }
      if (this.ProvincePreparations[i]) {
        data.prep_province = this.ProvincePreparations[i].toString();
      }
      if (this.UM_jour[i]) {
        data.UM_jour = this.UM_jour[i].toString();
      }
      if (this.UM_nuit[i]) {
        data.UM_nuit = this.UM_nuit[i].toString();
      }
      if (this.UM_province[i]) {
        data.UM_province = this.UM_province[i].toString();
      }
      preparations.push(
        data
      );
    }
    this.monthDays = [];
    this.JourPreparations = [];
    this.NuitPreparations = [];
    this.ProvincePreparations = [];
    this.UM_jour = [];
    this.UM_nuit = [];
    this.UM_province = [];

    this.service.addFacturation({ preparations: preparations }).subscribe(res => {
      //this.get_days_list();
      this.router.navigate(['/liste-facturation-preparation', this.code_client])

      this.openSnackBar("La facture est enregistré avec succès!", "Ok", 5000);

    },
      err => this.openSnackBar("Une erreur est survenue, veuillez réessayer. ", "Ok", 5000)
    )
  }

  // randomize(){
  //   for (var i = this.JourPreparations.length; i < this.monthDays.length; i++) {
  //     var min =1;
  //     var max = 11;
  //     this.JourPreparations[i] = Math.floor(Math.random() * (max - min + 1) + min);
  //     this.NuitPreparations[i] = Math.floor(Math.random() * (max - min + 1) + min);
  //   }
  // }

}

