import { Component,HostBinding } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiService } from './list-file-edi.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list-file-edi',
  templateUrl: './list-file-edi.component.html',
  styleUrls: ['./list-file-edi.component.scss']
})
export class ListFileEDIComponent extends UpgradableComponent{
  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  limit = 5;
  selection = new SelectionModel<PeriodicElement>(true, []);
  actions: any[] = [
    { value: 'analyser', viewValue: 'Analyser' },
  ];
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  files = [];
  constructor(private tablesService: ListFileEdiService,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar)
    {
    super();
    this.completeTable = this.tablesService.advanceTableData;
    console.log(this.completeTable)
    this.getFiles();
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
  openSnackBar(message: string, action: string) {
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
  public getFiles ()
  {
    this.tablesService.getAllFiles()
      .subscribe(res => {this.files = res; console.log(this.files);},
          // error => this.error = "error.message");
          // for fake data
          error => console.log(error));
  }

}
