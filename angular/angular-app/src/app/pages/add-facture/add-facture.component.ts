import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "postcss/lib/list";
import { elementAt } from "rxjs-compat/operator/elementAt";
import { FacturationPreparationService } from "../facturation-preparation/facturation-preparation.service";
import { AddFactureService } from "./add-facture.service";

@Component({
  selector: "app-add-facture",
  templateUrl: "./add-facture.component.html",
  styleUrls: ["./add-facture.component.scss"],
})
export class AddFactureComponent implements OnInit {
  public advancedHeaders = [];
  public monthDays: any = [];
  public monthInLetters: any;
  public code_client: any;
  JourPreparations: any = [];
  NuitPreparations: any = [];
  ProvincePreparations: any = [];
  Preparations: any = [];
  UM_jour: any = [];
  UM_nuit: any = [];
  UM_province: any = [];
  UM: any = [];
  client_name: string = "";
  mois: string;
  existingFacturation: any;
  monthNumber: number;
  yearNumber: number;
  UM_jour_one_prep: number;
  UM_nuit_one_prep: number;
  UM_province_one_prep: number;
  UM_one_prep = {};
  services_list = [];
  constructor(
    private service: AddFactureService,
    private facturationService: FacturationPreparationService,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.code_client = this.route.snapshot.params.client;
    var monthAndYear = this.route.snapshot.params.date;

    this.monthNumber = parseInt(monthAndYear.split("-")[0]) - 1;
    this.yearNumber = parseInt(monthAndYear.split("-")[1]);

    if (this.redirectIfNotCurrentOrNextMonth()) {
      this.get_days_list();
    }
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }

  redirectIfNotCurrentOrNextMonth() {
    var date = new Date();
    //check if the same year or not
    if (this.yearNumber != date.getFullYear()) {
      this.router.navigate([
        "/liste-facturation-preparation",
        this.code_client,
      ]);
      return false;
    }

    if (
      this.monthNumber != date.getMonth() - 1 &&
      this.monthNumber != date.getMonth() &&
      this.monthNumber != date.getMonth() + 1
    ) {
      this.router.navigate([
        "/liste-facturation-preparation",
        this.code_client,
      ]);
      return false;
    }
    return true;
  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  changeUM(i, j, param) {
    // if(param == "jour" && this.UM_jour_one_prep ){
    //   this.UM_jour[i] = parseInt(this.JourPreparations[i])*this.UM_jour_one_prep;
    //   if(this.JourPreparations[i].length == 0){
    //     this.UM_jour[i] = "";
    //   }
    // }else if(param == "nuit" && this.UM_nuit_one_prep){
    //   this.UM_nuit[i] = parseInt(this.NuitPreparations[i])*this.UM_nuit_one_prep;
    //   if(this.NuitPreparations[i].length == 0){
    //     this.UM_nuit[i] = "";
    //   }

    // }else if( param == "province" && this.UM_province_one_prep ){
    //   this.UM_province[i] = parseInt(this.ProvincePreparations[i])*this.UM_province_one_prep;
    //   if(this.ProvincePreparations[i].length == 0){
    //     this.UM_province[i] = "";
    //   }
    // }

    this.UM[j][i] =
      parseInt(this.Preparations[j][i]) *
      this.UM_one_prep["UM_" + this.services_list[j]];
    if (this.Preparations[j][i].length == 0) {
      this.UM[j][i] = "";
    }
  }

  get_days_list() {
    this.monthInLetters = new Date(this.yearNumber, this.monthNumber, 1)
      .toLocaleString("default", { month: "long" })
      .toLocaleUpperCase();
    this.mois = this.datePipe.transform(
      new Date(this.yearNumber, this.monthNumber, 1),
      "MM-yyyy"
    );
    var totalDaysInMonth = this.daysInMonth(this.monthNumber, this.yearNumber);
    this.client_name = this.facturationService.getClient();

    var data = {
      code_client: this.code_client,
      mois: this.mois,
    };
    this.facturationService.getFacturationForClients(data).subscribe(
      (res) => {
        this.existingFacturation = res.facture;
        for (var item of Object.keys(res)) {
          if (item.includes("UM")) {
            this.UM_one_prep[item] = res[item];
          }
        }
        this.advancedHeaders = Object.keys(this.UM_one_prep);
        if(this.advancedHeaders.length == 0){
          this.redirectIfMatriceIsEmpty();
        }
        this.advancedHeaders = this.advancedHeaders.map((element) => {
          return element.replace("UM_", "");
        });
        this.services_list = this.advancedHeaders;

        this.services_list.forEach((element) => {
          this.UM.push(Array(totalDaysInMonth).fill(''));
          this.Preparations.push(Array(totalDaysInMonth).fill(''));
        });
        // this.UM_jour_one_prep = parseInt(res.UM_jour);
        // this.UM_nuit_one_prep = parseInt(res.UM_nuit);
        // this.UM_province_one_prep = parseInt(res.UM_province);

        for (let i = 1; i <= totalDaysInMonth; i++) {
          var monthDate = new Date(this.yearNumber, this.monthNumber, i);
          this.monthDays.push(monthDate);
          this.existingFacturation.forEach((element) => {
            if (
              Date.parse(element.date) == Date.parse(monthDate.toDateString())
            ) {
              // this.JourPreparations.push(element.prep_jour);
              // this.NuitPreparations.push(element.prep_nuit);
              // this.ProvincePreparations.push(element.prep_province);
              // this.UM_jour.push(element.UM_jour);
              // this.UM_nuit.push(element.UM_nuit);
              // this.UM_province.push(element.UM_province);
              this.Preparations[this.services_list.indexOf(element.service)][i-1]  = element.prep;
              this.UM[this.services_list.indexOf(element.service)][i-1]  = element.UM;
            }
          });
        }
      },
      (err) => {
        this.openSnackBar("Une erreur est survenue", "Ok", 4000);
      }
    );
  }

  redirectIfMatriceIsEmpty(){
    this.openSnackBar(
      "Veuiller remplir la matrice du client avant d'insérer une facture.",
      "Ok",
      10000
    );
    this.router.navigate(["/configuration-critere", this.code_client]);

  }

  numberOnly(event, phrase): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((phrase == undefined || phrase.length == 0) && charCode == 48) {
      return false;
    }
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  insertFacturation() {
    let preparations: any = [];
    this.openSnackBar(
      "Le calcul de la facturation est en cours, veuillez patienter",
      "Ok",
      5000
    );

    // let max_prep = Math.max(this.JourPreparations.length, this.NuitPreparations.length, this.ProvincePreparations.length)
    let max_prep = 0;
    this.Preparations.forEach((element) => {
      if (element.length > max_prep) {
        max_prep = element.length;
      }
    });
    console.log(this.Preparations)
    console.log(max_prep)
    for (var i = 0; i < max_prep; i++) {
      for (var j = 0; j < this.Preparations.length; j++) {
        let data = {
          code_client: this.code_client,
          date: "",
          prep: undefined,
          UM: undefined,
          service: undefined,
        };
        data.date = this.datePipe.transform(this.monthDays[i], "yyyy-MM-dd");
        data.service = this.services_list[j];
        if (this.Preparations[j][i]) {
          data.prep = this.Preparations[j][i].toString();
        }
        if (this.UM[j][i]) {
          data.UM = this.UM[j][i].toString();
        }

        // if (this.JourPreparations[i]) {
        //   data.prep_jour = this.JourPreparations[i].toString();
        // }
        // if (this.NuitPreparations[i]) {
        //   data.prep_nuit = this.NuitPreparations[i].toString();
        // }
        // if (this.ProvincePreparations[i]) {
        //   data.prep_province = this.ProvincePreparations[i].toString();
        // }
        // if (this.UM_jour[i]) {
        //   data.UM_jour = this.UM_jour[i].toString();
        // }
        // if (this.UM_nuit[i]) {
        //   data.UM_nuit = this.UM_nuit[i].toString();
        // }
        // if (this.UM_province[i]) {
        //   data.UM_province = this.UM_province[i].toString();
        // }
        if (this.Preparations[j][i] && this.UM[j][i]) {
          preparations.push(data);
        }
      }
    }
    var old_monthDays = this.monthDays;
    this.monthDays = [];
    this.JourPreparations = [];
    this.NuitPreparations = [];
    this.ProvincePreparations = [];
    this.UM_jour = [];
    this.UM_nuit = [];
    this.UM_province = [];

    this.service.addFacturation({ preparations: preparations }).subscribe(
      (res) => {
        //this.get_days_list();
        this.router.navigate([
          "/liste-facturation-preparation",
          this.code_client,
        ]);

        this.openSnackBar("La facture est enregistré avec succès!", "Ok", 5000);
      },
      (err) => {
        if (err.error.message == "veuiller remplir la matrice du client") {
          this.openSnackBar(
            "Veuiller remplir la matrice du client avant d'insérer une facture.",
            "Ok",
            10000
          );
          this.router.navigate(["/configuration-critere", this.code_client]);
        } else {
          this.openSnackBar(
            "Une erreur est survenue, veuillez réessayer. ",
            "Ok",
            5000
          );
          this.monthDays = old_monthDays;
        }
      }
    );
  }
}
