import { Component, HostBinding } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiService } from './list-file-edi.service';
import { saveAs } from 'file-saver';

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
export class ListFileEDIComponent extends UpgradableComponent {
  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  clicked = new Array();
  limit = 15;
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
  show = true;
  constructor(private tablesService: ListFileEdiService,
    private router: Router,
  public dialog: MatDialog,
  private _snackBar: MatSnackBar)
  {
    super();
    this.completeTable = this.tablesService.advanceTableData;
  }

  ngOnInit() {
    this.getFiles();
  }

  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  public advancedHeaders = this.tablesService.getAdvancedHeaders();

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
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public getAdvancedTablePage(page, countPerPage) {
    return this.files.slice((page - 1) * countPerPage, page * countPerPage);
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
      this.changeAdvanceSorting(header.sort, index);
      this.changePage(1, true);
    }
  }
  public changeAdvanceSorting(order, index) {
    this.files = this.sortByAttributeObject(this.files, order, index);
  }

  public sortByAttributeObject(files, order, index) {
    if (index == 1) {
      return this.sortByDateOrder(files, order, index);
    }
    else if (index == 2) {
      return this.sortByClientName(files, order, index);
    }
  }

  private sortByDateOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.created_at.slice(0, 10) > b.created_at.slice(0, 10)) {
        return 1 * order;
      }
      if (a.created_at.slice(0, 10) < b.created_at.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByClientName(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.client_name > b.client_name) {
        return 1 * order;
      }
      if (a.client_name < b.client_name) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  setFilteredItems() {
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
  }

  filterItems(filterValue) {
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getFiles() {
    this.tablesService.getAllFiles()
      .subscribe(res => {
        this.files = res;
        this.show = false;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
        for (var i = 0; i < this.advancedTable.length; i++) {
          this.clicked.push(false);
        }
      },
        error => console.log(error));
  }
  public analyserEDI(row) {

    this.tablesService.executeJob(row)
      .subscribe(res => {
        console.log("success");
        this.router.navigate(['/list-file-edi']);
      }, error => console.log(error));
  }
  public actualiser() {
    this.advancedTable = [];
    this.show = true;
    this.files = [];
    this.getFiles();
  }
  public uploadFileInput(clientName, fileName) {
    fileName = fileName.substring(7)
    fileName = decodeURI(fileName)

    this.tablesService.uploadFileInput(clientName, fileName)
      .subscribe(res => {
        console.log(res);
        saveAs(res, fileName);
      }, error => console.log(error));
  }
  public decodefile(file) {

    return decodeURI(file.substring(7));
  }
  public decodeValidatorError(file) {

    return decodeURI(file);
  }
  public uploadFileOutput(clientName, fileName) {
    fileName = decodeURI(fileName)
    this.tablesService.uploadFileOutput(clientName, fileName)
      .subscribe(res => {
        console.log(res);
        saveAs(res, fileName);
      }, error => console.log(error));
  }
}

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 2500,
  //   });
  // }
  // openSnackBarError(message: string, action: string)
  // {
  //   this._snackBar.open(message, action, {
  //     duration: 2500,
  //     panelClass: ['mat-toolbar', 'mat-warn']
  //   });
  // }
