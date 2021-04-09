import { Component, HostBinding, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiService } from './list-file-edi.service';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
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
      if (a.createdAt.slice(0, 10) > b.createdAt.slice(0, 10)) {
        return 1 * order;
      }
      if (a.createdAt.slice(0, 10) < b.createdAt.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByClientName(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.contact.nomClient > b.contact.nomClient) {
        return 1 * order;
      }
      if (a.contact.nomClient < b.contact.nomClient) {
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
        console.log('files', this.files)
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
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction)
        this.router.navigate(['/list-file-edi']);
      }, error => console.log(error));
  }
  public actualiser() {
    this.advancedTable = [];
    this.show = true;
    this.files = [];
    this.getFiles();
  }
  public downloadFileInput(clientCode, fileName) {
    this.tablesService.downloadFileInput(clientCode, fileName)
      .subscribe(res => {
        saveAs(res, fileName);
      }, error => console.log(error));
  }


  gotoDetails(row) {
    this.router.navigate(['/details-file-edi', row.idFile])
  }

  public downloadFileOutput(clientCode, fileName) {
    this.tablesService.downloadFileOutput(clientCode, fileName)
      .subscribe(res => {
        console.log(res);
        saveAs(res, fileName);
      }, error => console.log(error));
  }

  sendFileToUrbantz(codeClient, validatedOrders) {
    let data = {
      clientCode: codeClient,
      fileName: validatedOrders,
    }
    this.tablesService.sendFileToUrbantz(data).subscribe(res => {
      console.log("res urbantz", res);
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogImportFile);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }

    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      // verticalPosition: 'bottom',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}

export interface StateGroup {
  letter: string;
  names: string[];
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  templateUrl: 'dialog/import-file-edi.component.html',
  styleUrls: ['dialog/import-file-edi.component.scss']
})
export class DialogImportFile {

  showloader = false;
  clicked = false;
  public snackAction = 'voir plus +';
  stateGroupOptions: Observable<StateGroup[]>;
  minWidth: number = 250;
  width: number = this.minWidth;
  public error: string = '';
  myForm = new FormGroup({
    // stateGroup: new FormControl('', [Validators.required],),
    file: new FormControl('',),
    fileSource: new FormControl('', [Validators.required],)
  });
  selectedFiles: File = null;
  clients: any;

  constructor(private importFileService: ImportFileEdiService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogImportFile>,
    private _snackBar: MatSnackBar
  ) {
  }
  public listObject: { id: string, nomClient: string }[] = [];
  public listItems: Array<string> = [];
  ngOnInit(): void {

  }


  selectFile(event) {
    if (event.target.files.length > 0) {
      this.selectedFiles = <File>event.target.files[0];
      this.myForm.patchValue({
        fileSource: this.selectedFiles
      });
    }

  }


  get f() {
    return this.myForm.controls;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  onNoclick() {
    this.dialogRef.close();
  }

  submit() {
    this.showloader = true;
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    this.importFileService.upload(formData).subscribe(
      (res) => {
        console.log(res);
        this.showloader = false;
        if (res[0].archive == false || res[0].existe == false) {
          this.openSnackBar("Veuillez vérifier la validité de ces clients ", this.snackAction)
        }
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        this.error = "Veuillez télécharger un fichier EDI";
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}

