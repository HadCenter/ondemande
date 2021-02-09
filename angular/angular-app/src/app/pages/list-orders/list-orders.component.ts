import { Component, HostBinding, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UpgradableComponent } from '../../../theme/components/upgradable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ListOrderService } from './list-orders.service';
import { SelectionModel } from '@angular/cdk/collections';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss'],
})
export class ListOrdersComponent extends UpgradableComponent {

  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  limit = 20;
  selection = new SelectionModel<PeriodicElement>(true, []);
  actions: any[] = [
    { value: 'transférer', viewValue: 'Transférer' },
    { value: 'supprimer', viewValue: 'Supprimer' },
  ];

  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;

  public constructor(private tablesService: ListOrderService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    super();
    this.completeTable = this.tablesService.advanceTableData;
    console.log(this.completeTable)
  }

  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };
  public advancedHeaders = this.tablesService.getAdvancedHeaders();

  public typeArticleColors = {
    'frozen': 'teal',
    'delicate': 'red',
  }
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

  /* available sort value:
	-1 - desc; 	0 - no sorting; 1 - asc; null - disabled */
  public changeSorting(header, index) {
    const current = header.sort;
    if (current !== null) {
      this.advancedHeaders.forEach((cell) => {
        cell.sort = (cell.sort !== null) ? 0 : null;
      });
      header.sort = (current === 1) ? -1 : 1;
      this.tablesService.changeAdvanceSorting(header.sort, index);
      this.changePage(1, true);
    }
  }

  public gotoDetails(id_order) {
    this.router.navigate(['/details-order', id_order]);
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
openDialog(order): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: order
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result != undefined)
         {
            this.order = result;
            let miniOrder =
            {
              "type": this.order.type,
              "taskId": this.order.taskId,
              "taskReference": this.order.taskReference,
              "date": this.order.date
            }
            this.tablesService.findByTaskId(miniOrder.taskId).subscribe(res => {
              if (res == null)
              {
                this.tablesService.save(miniOrder).subscribe(result => {
                  console.log(result);
                  this.openSnackBar("Commande ajoutée à Urbantz avec succés", this.snackAction)
                  }, error => console.error(error));
              }
              else
              {
                this.openSnackBarError("Cette commande existe déja à Urbantz!", this.snackAction)
              }
            },
              error => console.error(error));
            }
            });
         }

      openSnackBar(message: string, action: string)
      {
        this._snackBar.open(message, action, {
        duration: 2500,
      });
      }
      openSnackBarError(message: string, action: string)
      {
        this._snackBar.open(message, action, {
          duration: 2500,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}







