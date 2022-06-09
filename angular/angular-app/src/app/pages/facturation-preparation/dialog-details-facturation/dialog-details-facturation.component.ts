import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigJourFerieService } from 'app/pages/config-jour-ferie/config-jour-ferie.service';
import { FacturationPreparationService } from '../facturation-preparation.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-details-facturation',
  templateUrl: './dialog-details-facturation.component.html',
  styleUrls: ['./dialog-details-facturation.component.scss']
})
export class DialogDetailsFacturationComponent implements OnInit {
  jourFerieList: string[] = [];

  constructor(public dialogRef: MatDialogRef<DialogDetailsFacturationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FacturationPreparationService,
    private _snackBar: MatSnackBar,
    private configJourFerieService: ConfigJourFerieService) { }

  public advancedHeaders: any = [];
  factures: any = [];
  acturationPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable: Array<any>;
  show = true;
  public mois: any;
  public nom_mois: any;
  public client_name: string = "";
  public code_client: any;
  public sum_jour: number = 0;
  public sum_nuit: number = 0;
  public sum_province: number = 0;
  public sum_diff_jour: number = 0;
  public sum_diff_nuit: number = 0;
  public sum_diff_province: number = 0;
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  ngOnInit(): void {
    this.getFacturation();

    this.getHolidaysAndWeekends();

  }
  getFacturation(){
    var data = {
      "code_client": this.code_client,
      "mois": this.mois
    }
    var date = this.mois.split('-');
    this.nom_mois = new Date(parseInt(date[1]), parseInt(date[0]) - 1, 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.client_name = this.service.getClient();
    this.service.getFacturationForClients(data).subscribe(res => {
      this.advancedTable = res.facture;
      if (res.facture.length > 0) {
        this.advancedHeaders = Object.keys(this.advancedTable[0]);
        this.advancedTable.forEach(element => {
          this.sum_jour += element.total_jour;
          this.sum_nuit += element.total_nuit;
          this.sum_province += element.total_province;
          this.sum_diff_jour += element.diff_jour;
          this.sum_diff_nuit += element.diff_nuit;
          this.sum_diff_province += element.diff_province;
        })
      }
    },
      error => {
        console.log(error)
      });
  }
  getHolidaysAndWeekends() {
    this.configJourFerieService.getHolidays().subscribe(res => {
      this.jourFerieList = res.holidays.split(',');
    },
      err => {
        console.error(err)
      })
  }

  checkIfWeekendOrHoliday(date): boolean {
    if(this.jourFerieList.includes(date.substring(0,10))){
      return true
    }
    return false
  }
  downloadFile(){
    this.openSnackBar('Téléchargement du fichier en cours...', 'Ok');
    var data = {
      "code_client": this.code_client,
      "mois": this.mois
    }
    this.service.downloadFacturationFile(data)
    .subscribe(res => {
      this.openSnackBar('Le fichier est téléchargé avec succès.', 'Ok');
      saveAs(res, "Preparation_"+this.client_name+"_"+this.mois+".xlsx");
    }, error => this.openSnackBar('Une erreur est survenue', 'Ok'));

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      // verticalPosition: 'bottom',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}
