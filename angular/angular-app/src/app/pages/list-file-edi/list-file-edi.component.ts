import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiService } from './list-file-edi.service';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './customSnackBar/snackbar/snackbar.component';

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
  sendedToUrbantz = new this.Array()
  limit = 15;
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
  copyFilesPerPagination = [];
  show = true;
  copy_advancedTable: any[];
  allTable: any[];
  showJobRun = false;

  constructor(private tablesService: ListFileEdiService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    super();
    this.completeTable = this.tablesService.advanceTableData;
  }
  ngOnInit() {
    this.listenToWebSocket();
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
    return this.copyFilesPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.copyFilesPerPagination = this.sortByAttributeObject(this.copyFilesPerPagination, order, index);
  }

  /***Sort by diff column */
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

  /**** Filter items */
  setFilteredItems() {
    this.copyFilesPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyFilesPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyFilesPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyFilesPerPagination.slice(0, this.countPerPage);
  }

  filterItems(filterValue: string) {
    let _filterValue = !filterValue.includes('/') ? filterValue : filterValue.split('/').join('-');
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(_filterValue.toLowerCase());
    });
  }

  public getFiles() {
    this.tablesService.getAllFiles()
      .subscribe(res => {
        this.files = res;
        this.copyFilesPerPagination = this.files;
        console.log('files', this.files)
        this.show = false;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */
        console.log("advanced", this.advancedTable)
        this.copy_advancedTable = this.advancedTable; /***copy for filter */
        this.allTable = this.advancedTable; /****all content */
        for (var i = 0; i < this.advancedTable.length; i++) {
          this.clicked.push(false);
          this.sendedToUrbantz.push(false);
        }
      },
        error => console.log(error));
  }

  public analyserEDI(row) {
    this.tablesService.executeJob(row)
      .subscribe(res => {
        console.log("success");
        row.cliqued = true;
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction)
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

  sendFileToUrbantz(row, index) {
    let data = {
      clientCode: row.contact.codeClient,
      fileName: row.validatedOrders,
      fileId: row.idFile
    }
    this.tablesService.sendFileToUrbantz(data).subscribe(
      result => {
        // Handle result
        console.log("res urbantz", result)
      },
      error => {
        this.openSnackBar("Erreur d’envoi", this.snackAction);
      },
      () => {
        // No errors
        this.sendedToUrbantz[index] = true;
        this.openSnackBar("Envoyé avec succès", this.snackAction);
      })
  }

  /******Open dialog Import File */
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

  listenToWebSocket() {
    this.tablesService.messages.subscribe(msg => {
      console.log("Response from websocket: ", JSON.parse(msg));
      localStorage.setItem('wsEdi', JSON.stringify(JSON.parse(msg)));
      if(JSON.parse(msg).stateEdi === "table ediFile updated")
      {
        this.actualiser();
      }
    });
  }

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
  snackActionExpediteur = "ok";
  minWidth: number = 250;
  width: number = this.minWidth;
  public error: string = '';
  myForm = new FormGroup({
    file: new FormControl('',),
    fileSource: new FormControl('', [Validators.required],)
  });
  selectedFiles: File = null;
  clients: any;
  snackBarRef: any;
  nbExpNotArchived: number;
  expediteurArray: any = [];
  expediteurArrayFiltred: any;

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
    this.error="";
    this.clicked=false;
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
    this.snackBarRef = this._snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  openSnackbarListExpediteur() {
    this._snackBar.openFromComponent(SnackbarComponent, {
      panelClass: "snack-exp",
      verticalPosition: 'top',
      horizontalPosition: 'center',
      data: this.expediteurArrayFiltred
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
    this.clicked=true;
    this.showloader = true;
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    this.importFileService.upload(formData).subscribe(
      (res) => {
        this.showloader = false;

        /******* Test if expediteur is arrchived and existe */
        this.expediteurArray = Object.keys(res).map(i => res[i]);
        this.expediteurArrayFiltred = this.expediteurArray;
        this.expediteurArrayFiltred = this.expediteurArrayFiltred.filter(obj => obj.archive == true || obj.existe == false)
        if (this.expediteurArrayFiltred.length > 0) {
          this.openSnackBar("Veuillez vérifier la validité de ces clients ", this.snackAction);
          this.snackBarRef.onAction().subscribe(() => {
            this.openSnackbarListExpediteur()
          });
        }

        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        this.myForm.reset();
        this.error = "Veuillez télécharger un fichier EDI";
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}

