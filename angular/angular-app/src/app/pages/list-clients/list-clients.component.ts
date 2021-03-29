import { SelectionModel } from '@angular/cdk/collections';
import { Component, HostBinding, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListClientsService } from './list-clients.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogBodyComponent } from '../../components/dialog-body/dialog-body.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateClientService } from './dialog/create-client.service';

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

  openAddClient() {
    const dialogRef = this.matDialog.open(DialogCreateClient);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }

    });
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
        console.warn("dataaaa",value.data)
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
    this.router.navigate(['/details-client', id_client]);
  }

}

@Component({
  templateUrl: 'dialog/create-client.component.html',
  styleUrls: ['dialog/create-client.component.scss']
})
export class DialogCreateClient extends UpgradableComponent {
  public loginForm: FormGroup;
  public code;
  public nom;
  public email;
  public password;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public codePattern = '^C[0-9]{3}$';
  public nomPattern = '[^a-z]+';
  public error: string;
  showloader = false;

  constructor(private authService: CreateClientService,
    public dialogRef: MatDialogRef<DialogCreateClient>,
    private fb: FormBuilder,
    private router: Router) {
    super();
    this.loginForm = this.fb.group({
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(this.codePattern),
      ]),
      nom: new FormControl('', [
        Validators.required,
        Validators.pattern(this.nomPattern),
      ]),
      email: new FormControl('', [
        Validators.pattern(this.emailPattern),

      ])
    });
    this.code = this.loginForm.get('code');
    this.nom = this.loginForm.get('nom');
    this.email = this.loginForm.get('email')

  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });

  }
  public login() {
    this.error = null;
    if (this.loginForm.valid) {
      this.showloader = true;
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(res => {
          this.showloader = false;
          this.dialogRef.close('submit');
          // this.router.navigate(['/list-client']);
        },
          // error => this.error = "error.message");
          // for fake data
          (err) => {
            this.showloader = false;
            err => this.error = "Le client déjà existe"
          });
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }



}
