import { SelectionModel } from '@angular/cdk/collections';
import { Component, HostBinding, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListClientsService } from './list-clients.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBodyComponent } from '../../components/dialog-body/dialog-body.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsClientService } from './details-client/details-client.service';
// import { CreateClientService } from './dialog/create-client.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent extends UpgradableComponent implements OnInit {
  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  limit = 15;
  selection = new SelectionModel<PeriodicElement>(true, []);
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  clients = [];
  show = true;
  public constructor(private tablesService: ListClientsService,
    private router: Router,
    private _snackBar: MatSnackBar, private matDialog: MatDialog) {
    super();
  }
  ngOnInit(): void {
    this.getClients();
  }
  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  public actualiser() {
    this.advancedTable = [];
    this.show = true;
    this.clients = [];
    this.getClients();
  }

  openDialog(client) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      width: '250px',
      data: client
    };
    let dialogRef = this.matDialog.open(DialogBodyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(value => {
      if (value != undefined) {
        this.tablesService.archiveClient(value.data.idContact, value.data).subscribe(
          res => {
            this.openSnackBar("Client archivé avec succés", this.snackAction)
            this.getClients();
          },
          error => console.log(error));
      }
    });
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top'
    });
  }
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public getAdvancedTablePage(page, countPerPage) {
    return this.clients.slice((page - 1) * countPerPage, page * countPerPage);
  }

  setFilteredItems() {
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
  }
  filterItems(filterValue) {
    return this.clients.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }
  public getClients() {
    this.tablesService.getAllClients()
      .subscribe(res => {
        this.clients = res;
        this.numPage = Math.ceil(res.length / this.countPerPage); this.show = false;
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
      },
        error => console.log(error));
  }
  public gotoDetails(id_client) {
    const dialogRef = this.matDialog.open(DetailsClientComponent, {
      // width: '250px',
      data: { id: id_client }
    });
  }

}


export interface DialogData {
  id: string;
}

export class Client {
  id?: any;
  code_client?: string;
  nom_client?: string;
  email?: string;
}
@Component({
  templateUrl: './details-client/details-client.component.html',
  styleUrls: ['./details-client/details-client.component.scss']
})
export class DetailsClientComponent extends UpgradableComponent implements OnInit {
  currentClient: Client = {
    code_client: '',
    nom_client: '',
    email: ''
  };
  id: string;

  constructor(
    public dialogRef: MatDialogRef<DetailsClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clientService: DetailsClientService) {
    super();
  }

  ngOnInit(): void {
    this.getClient(this.data.id);
  }

  getClient(id: string): void {
    this.clientService.get(id)
      .subscribe(
        data => {
          this.currentClient = data;
        },
        error => {
          console.log(error);
        });
  }

}

