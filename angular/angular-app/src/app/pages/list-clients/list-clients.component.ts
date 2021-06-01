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
import { TokenClientService } from './token-client/token-client.service';
import { AuthService } from '@services/*';

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
  public user : any;
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
  copyClientsPerPagination = [];
  show = true;
  public constructor(private authService: AuthService,private tablesService: ListClientsService,
    private router: Router,
    private _snackBar: MatSnackBar, private matDialog: MatDialog) {
    super();
  }
  ngOnInit(): void {
    this.authService.userData.subscribe(
      user => this.user = user);
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
    return this.copyClientsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }

  setFilteredItems() {
    this.copyClientsPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyClientsPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyClientsPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyClientsPerPagination.slice(0,this.countPerPage);
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
        this.copyClientsPerPagination = this.clients;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.show = false;
        this.addStatusForSearch();
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
      },
        error => console.log(error));
  }
  /***
    deux solutions:
      1- créer un attribut status et supprimer l'attribut archived
      2- modifier le model client : archived : booléen ====> status : string
        j'ai choisi 1 ère solution parceque si je modifie le model normalemnent je vais cassé le travail de
        amine.
  ***/
  public addStatusForSearch()
  {
    for (let i = 0; i < this.clients.length; i++)
    {
      if(this.clients[i].archived === false)
      {
        this.clients[i].status = 'Actif' // add status to client object
      }else{
        this.clients[i].status = 'Archivé' // add status to client object
      }
      delete this.clients[i].archived; // delete archived pour éviter la confusion lors de recherche
    }
  }
  public gotoDetails(id_client) {
    const dialogRef = this.matDialog.open(DetailsClientComponent, {
      // width: '250px',
      data: { id: id_client }
    });
  }
  public openDialog(id_client)
  {
    const dialogRef = this.matDialog.open(TokenClientComponent, {
       width: '300px',
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

@Component({
  templateUrl: './token-client/token-client.component.html',
  styleUrls: ['./token-client/token-client.component.css']
})
export class TokenClientComponent extends UpgradableComponent implements OnInit {
   currentClient = {};
  constructor(public dialogRef: MatDialogRef<TokenClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private clientService: TokenClientService) { super(); }

  ngOnInit(): void {
    this.getClient(this.data.id);
  }
  getClient(id: string): void {
    this.clientService.getClient(id)
      .subscribe(
        data => {
          this.currentClient = data;
          console.log(this.currentClient);
        },
        error => {
          console.log(error);
    });
  }
  sauvegarder()
  {
    var id = this.currentClient['id'];
    var data = this.currentClient;
    this.clientService.updateClientToken(id,data).subscribe(
      (res) => {
        console.log(res);
        this.dialogRef.close('submit');
      },
      (err) => {
        console.log(err);
      }
    );

  }

}

