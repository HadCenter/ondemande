import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FacturationPreparationService } from "../facturation-preparation/facturation-preparation.service";
import { saveAs } from "file-saver";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigJourFerieService } from "../config-jour-ferie/config-jour-ferie.service";

@Component({
  selector: "app-details-facture",
  templateUrl: "./details-facture.component.html",
  styleUrls: ["./details-facture.component.scss"],
})
export class DetailsFactureComponent implements OnInit {
  totals: any = [];
  diffs: any = [];
  Total: number = 0;
  Diff: number = 0;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private configJourFerieService: ConfigJourFerieService,
    private service: FacturationPreparationService
  ) {}

  public advancedHeaders: any = [];
  factures: any = [];
  acturationPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable: Array<any>;
  show = true;
  public moisFacture: any;
  public mois: any;
  public client: any;
  public client_name: string = "";
  jourFerieList: string[] = [];
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  ngOnInit(): void {
    this.getFacturationV2();
    this.getHolidaysAndWeekends();
  }

  getFacturationV2() {
    this.moisFacture = this.route.snapshot.params.facture;
    this.client = this.route.snapshot.params.client;
    var date = this.moisFacture.split("-");
    this.mois = new Date(parseInt(date[1]), parseInt(date[0]) - 1, 1)
      .toLocaleString("default", { month: "long" })
      .toLocaleUpperCase();

    var data = {
      code_client: this.client,
      mois: this.moisFacture,
    };
    let dataTable = [];
    var date = this.mois.split("-");
    this.client_name = this.service.getClient();
    this.service.getFacturationForClients(data).subscribe(
      (res) => {
        this.advancedTable = res.facture;
        if (res.facture.length > 0) {
          dataTable = Object.assign([], res.facture);
          dataTable.forEach((element) => {
            element["prep_" + element["service"]] = element["prep"];
            element["UM_" + element["service"]] = element["UM"];
            element["total_" + element["service"]] = element["total"];
            element["diff_" + element["service"]] = element["diff"];

            delete element.prep;
            delete element.UM;
            delete element.diff;
            delete element.total;
          });
          dataTable.forEach((element) => {
            dataTable.forEach((el) => {
              if (el.date == element.date && el.service != element.service) {
                element = Object.assign(element, el);
              }
            });
            delete element.service;
          });
          this.advancedTable = [];
          var unique_dates = [];
          dataTable.forEach((element) => {
            if (!unique_dates.includes(element.date)) {
              this.advancedTable.push(element);
              unique_dates.push(element.date);
            }
          });

          this.advancedHeaders = Object.keys(this.advancedTable[0]);
          this.advancedHeaders.forEach((element) => {
            if (element.includes("total")) {
              this.totals.push(0);
              this.diffs.push(0);
            }
          });

          var preps = [];
          var UMs = [];
          var totalsheader = [];
          var diffsheader = [];

          this.advancedHeaders.forEach((element) => {
            if (element.includes("prep")) {
              preps.push(element);
            }
            if (element.includes("UM")) {
              UMs.push(element);
            }
            if (element.includes("total")) {
              totalsheader.push(element);
            }
            if (element.includes("diff")) {
              diffsheader.push(element);
            }
          });
          this.advancedHeaders = [];
          this.advancedHeaders.push("date");
          this.advancedHeaders.push(...preps);
          this.advancedHeaders.push(...UMs);
          this.advancedHeaders.push(...totalsheader);
          this.advancedHeaders.push(...diffsheader);

          this.advancedTable.forEach((element) => {
            var index_total = 0;
            var index_diff = 0;
            for (var el in element) {
              if (el.includes("total")) {
                this.totals[index_total] += element[el];
                index_total += 1;
                this.Total += element[el];
              }
              if (el.includes("diff")) {
                this.diffs[index_diff] += element[el];
                index_diff += 1;
                this.Diff += element[el];
              }
            }
          });
        }
        this.show = false;
      },
      (error) => {
        console.log(error);
        this.show = false;
      }
    );
  }

  downloadFile() {
    this.openSnackBar("Téléchargement du fichier en cours...", "Ok");
    var data = {
      code_client: this.client,
      mois: this.moisFacture,
    };
    this.service.downloadFacturationFile(data).subscribe(
      (res) => {
        this.openSnackBar("Le fichier est téléchargé avec succès.", "Ok");
        saveAs(
          res,
          "Preparation_" + this.client_name + "_" + this.moisFacture + ".xlsx"
        );
      },
      (error) => this.openSnackBar("Une erreur est survenue", "Ok")
    );
  }
  getHolidaysAndWeekends() {
    this.configJourFerieService.getHolidays().subscribe(
      (res) => {
        this.jourFerieList = res.holidays.split(",");
      },
      (err) => {
        console.error(err);
      }
    );
  }

  checkIfWeekendOrHoliday(date): boolean {
    if (this.jourFerieList.includes(date.substring(0, 10))) {
      return true;
    }
    return false;
  }
  backToPreviousPage() {
    this.router.navigate([`/liste-facturation-preparation/${this.client}`]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      // verticalPosition: 'bottom',
      verticalPosition: "top",
      horizontalPosition: "center",
    });
  }
}
