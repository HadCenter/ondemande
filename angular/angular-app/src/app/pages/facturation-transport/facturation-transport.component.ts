import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FacturationTransportService } from './facturation-transport.service';
import { ModifyFactureComponent } from './dialog-modify-facture/modify-facture.component';
import { CallJobComponent } from './dialog-call-job/call-job.component';

@Component({
  selector: 'app-facturation-transport',
  templateUrl: './facturation-transport.component.html',
  styleUrls: ['./facturation-transport.component.scss']
})
export class FacturationTransportComponent implements OnInit {
  public advancedHeaders = this.service.getAdvancedHeaders();
  // public advancedTable = [{
  //   "RL_Numero_de_facture__c": "ET_2022040003",
  //   "RL_Account__c": "CAJOO",
  //   "RL_BillingDisplayDate__c": "30-04-2022",
  //   "RL_Echeance__c": "15-05-2022",
  //   "RL_Prix_H_T__c": "46700 €",
  //   "RL_TauxTVA__c": "20",
  //   "RL_MontantTVA__c": "9355 €",
  //   "RL_TotalPrice__c": "56131 €",
  // }];
  showLowderListFacturationSF = true;
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 1;
  advancedTable: any = [];
  advancedTablePerFilter: any;
  public filterValue: any;
  files: any;

  constructor(private service: FacturationTransportService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.service.getAllFacturesPDFFromSalesforce().subscribe(res => {
      this.files = res;
      this.numPage = Math.ceil(res.length / this.countPerPage);
      this.advancedTablePerFilter = this.files;
      this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */

      this.showLowderListFacturationSF = false;
    })
  }

  downloadFactureSF(facture) {
    this.openSnackBar("Téléchargement du fichier en cours...", "Ok");
    var data = {
      "FacturesIds": [facture.Id],
      "factNames": [facture.RL_Numero_de_facture__c],
      "nomsClients": [facture.RL_Account__r.Name],
      "AccountsIds": [facture.RL_Account__c],
    }
    this.service.downloadFacturePDFFromSalesforce(data).subscribe(res => {
      //this.openSnackBar('Le fichier est téléchargé avec succès.', 'Ok');
      window.open(res, "_blank");
    },
      err => {
        this.openSnackBar('Une erreur est survenue', 'Ok');
      })
  }
  getColor(ch) {
    if (ch === 'En attente') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch === 'En cours') {
      return 'orange';
    } else {
      return 'red';
    }
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  public getAdvancedTablePage(page, countPerPage) {
    return this.advancedTablePerFilter.slice((page - 1) * countPerPage, page * countPerPage);
  }

  gotoBilling() {
    this.router.navigate(['/facturation-transport/billing'])
  }

  gotojobs() {
    this.router.navigate(['/facturation-transport'])
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 45000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  /**** Filter items */
  setFilteredItems() {
    this.advancedTablePerFilter = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.advancedTablePerFilter.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.advancedTablePerFilter.length / this.countPerPage);
    this.advancedTable = this.advancedTablePerFilter.slice(0, this.countPerPage);
  }

  filterItems(filterValue: string) {
    let _filterValue = !filterValue.includes('/') ? filterValue : filterValue.split('/').join('-');
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(_filterValue.toLowerCase());
    });
  }

  modifyFacture(data) {
    const dialogRef = this.matDialog.open(ModifyFactureComponent, {
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });

  }
  actualiser() {
    this.showLowderListFacturationSF = true;
    this.files = [];
    this.advancedTable = [];
    this.service.getAllFacturesPDFFromSalesforce().subscribe(res => {
      this.files = res;
      this.numPage = Math.ceil(res.length / this.countPerPage);
      this.advancedTablePerFilter = this.files;
      this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */

      this.showLowderListFacturationSF = false;
    })
  }


}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};