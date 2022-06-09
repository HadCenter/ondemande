import { Component, OnInit } from '@angular/core';
import { ListFacturationPreparationService } from './list-facturation-preparation.service';
import { Router } from '@angular/router';
import { DialogAddClientComponent } from './dialog-add-client/dialog-add-client.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { X } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-list-facturation-preparation',
  templateUrl: './list-facturation-preparation.component.html',
  styleUrls: ['./list-facturation-preparation.component.scss']
})
export class ListFacturationPreparationComponent implements OnInit {
  clients: any = [];
  clientsPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  show = true;
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };
  public advancedHeaders = this.service.getAdvancedHeaders();

  constructor(private service: ListFacturationPreparationService, 
    private router: Router, 
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getClients();
  }

  actualiser() {
    this.clients = [];
    this.clientsPerPagination = [];
    this.numPage = 0;
    this.show = true;
    this.advancedTable = [];
    this.getClients();

  }
  public getClients() {
    this.service.getClients()
      .subscribe(res => {
        this.clients = res;
        this.clientsPerPagination = this.clients;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.show = false;
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */

      },
        error => {
          this.openSnackBar('Une erreur est survenue', 'Ok');
        });
  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.clientsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  gotoConfiguration(code_client) {
    this.router.navigate(['/configuration-critere', code_client])
  }

  gotoFacturation(code_client) {
    this.router.navigate(['/liste-facturation-preparation', code_client])
  }
  gotoConfigurationHolidays() {
    this.router.navigate(['/config-jour-ferie'])
  }
  gotoAddClient() {
    this.router.navigate(['/configuration-critere/client/add-client'])
  }
  openAddClientDialog() {
    var existingClients = [];
    this.clients.forEach(element => {
      existingClients.push({nomClient:element.nom_client, codeClient:element.code_client})
    });
    
    const dialogRef = this.dialog.open(DialogAddClientComponent, {
      width: "fit-content",
      minWidth: "450px",
      maxWidth: "fit-content",
      minHeight: 'fit-content',
      maxHeight: 'fit-content',
      height: 'fit-content',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.componentInstance.ExistingClients = existingClients;

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
        this.openSnackBar("Client ajouté avec succès, veuiller remplir la matrice.", "Ok");
        this.router.navigate(['/configuration-critere/',result])
      }
    });
  }
}
