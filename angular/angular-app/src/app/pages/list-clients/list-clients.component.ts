import { SelectionModel } from '@angular/cdk/collections';
import { Component,HostBinding, OnInit  } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ClientComponent } from './client/client.component';
import { ListClientsService } from './list-clients.service';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBodyComponent } from '../../components/dialog-body/dialog-body.component';

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
export class ListClientsComponent extends UpgradableComponent implements  OnInit {
  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  limit = 15;
  selection = new SelectionModel<PeriodicElement>(true, []);
  actions: any[] = [
    { value: 'supprimer', viewValue: 'Supprimer' },
  ];

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
    /*this.completeTable = this.tablesService.advanceTableData;
    console.log(this.completeTable)*/

  }
  ngOnInit(): void
   {
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
        if (value != undefined)
        {

          this.tablesService.archiveClient(value.data.id, value.data).subscribe(
                res =>
                  {
                    this.openSnackBar("Client archivé avec succés", this.snackAction)
                    this.getClients();
                  },
                error => console.log(error));
        }
    });
  }
  openSnackBar(message: string, action: string)
      {
        this._snackBar.open(message, action, {
        duration: 2500,
        verticalPosition: 'top'
      });
      }
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  public currentPage = 1;
  private countPerPage = 20;
  public numPage = this.tablesService.getAdvancedTableNumOfPage(this.countPerPage);

  public advancedTable = this.tablesService.getAdvancedTablePage(1, this.countPerPage);

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.tablesService.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.advancedTable.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.advancedTable.forEach(row => this.selection.select(row));
  }
   /** The label for the checkbox on the passed row */
   checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  setFilteredItems() {
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
  }

  filterItems(filterValue) {
    return this.completeTable.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getClients ()
  {
    this.tablesService.getAllClients()
      .subscribe(res => {this.clients = res; this.show = false; console.log(this.clients);},
          // error => this.error = "error.message");
          // for fake data
          error => console.log(error));
  }
   public gotoDetails(id_client) {
    this.router.navigate(['/details-client', id_client]);
  }


}
