import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturationPreparationService } from '../facturation-preparation/facturation-preparation.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-details-facture',
  templateUrl: './details-facture.component.html',
  styleUrls: ['./details-facture.component.scss']
})
export class DetailsFactureComponent implements OnInit {
  sum_jour: number = 0;
  sum_nuit: number = 0;
  sum_province: number = 0;
  sum_diff_jour: number = 0;
  sum_diff_nuit: number = 0;
  sum_diff_province: number = 0;

  constructor(private route: ActivatedRoute,
    private _snackBar: MatSnackBar
,
    private service: FacturationPreparationService) { }

  public advancedHeaders: any = [];
  factures: any = [];
  acturationPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  show = true;
  public moisFacture: any;
  public mois: any;
  public client: any;
  public client_name:string="";
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  ngOnInit(): void {
    this.moisFacture = this.route.snapshot.params.facture;
    this.client = this.route.snapshot.params.client;
    var date = this.moisFacture.split('-');
    this.mois = new Date(parseInt(date[1]), parseInt(date[0])-1 , 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.client_name = this.service.getClient();


    var data = {
      "code_client": this.client,
      "mois": this.moisFacture
    }
    this.service.getFacturationForClients(data).subscribe(res => {
      this.advancedTable = res;
      this.advancedHeaders = Object.keys(this.advancedTable[0]);
      this.advancedTable.forEach(element => {
        console.log(element.total_jour);
        this.sum_jour += element.total_jour;
        this.sum_nuit += element.total_nuit;
        this.sum_province += element.total_province;
        this.sum_diff_jour += element.diff_jour;
        this.sum_diff_nuit += element.diff_nuit;
        this.sum_diff_province += element.diff_province;
      })

    },
      error => console.log(error));
  }
  downloadFile() {
    this.openSnackBar('Téléchargement du fichier en cours...', 'Ok');
    var data = {
      "code_client": this.client,
      "mois": this.moisFacture
    }
    this.service.downloadFacturationFile(data)
      .subscribe(res => {
        this.openSnackBar('Le fichier est téléchargé avec succès.', 'Ok');
        saveAs(res, "Preparation_" + this.client_name + "_" + this.moisFacture + ".xlsx");
      }, error => this.openSnackBar('Une erreur est survenue', 'Ok')
      );

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
