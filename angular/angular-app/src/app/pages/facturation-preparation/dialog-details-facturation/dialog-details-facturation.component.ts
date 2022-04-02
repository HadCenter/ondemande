import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacturationPreparationService } from '../facturation-preparation.service';

@Component({
  selector: 'app-dialog-details-facturation',
  templateUrl: './dialog-details-facturation.component.html',
  styleUrls: ['./dialog-details-facturation.component.scss']
})
export class DialogDetailsFacturationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDetailsFacturationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FacturationPreparationService) { }

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
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  ngOnInit(): void {
    var data = {
      "code_client": this.code_client,
      "mois": this.mois
    }
    var date = this.mois.split('-');
    this.nom_mois = new Date(parseInt(date[1]), parseInt(date[0]) - 1, 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.client_name = this.service.getClient();
    this.service.getFacturationForClients(data).subscribe(res => {
      this.advancedTable = res;
      if (res.length > 0) {
        this.advancedHeaders = Object.keys(this.advancedTable[0]);
        this.advancedTable.forEach(element => {
          console.log(element.total_jour);
          this.sum_jour += element.total_jour;
          this.sum_nuit += element.total_nuit;
          this.sum_province += element.total_province;
        })
      }
    },
      error => {
        console.log(error)
      });



  }



}
