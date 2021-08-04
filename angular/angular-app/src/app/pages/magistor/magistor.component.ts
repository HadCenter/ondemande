import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MagistorService } from './magistor.service';
import { MatDialog, MatDialogRef,} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-magistor',
  templateUrl: './magistor.component.html',
  styleUrls: ['./magistor.component.scss']
})
export class MagistorComponent implements OnInit {
  files = [];
  copyFilesPerPagination = [];
  show = true;
  copy_advancedTable: any[];
  allTable: any[];

  fichiers: any = [];
  public filterValue: any;

  constructor(
    private tablesService: MagistorService,
    private router: Router,
    public dialog: MatDialog)
    { }
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 1;
  public advancedTable = [];

  ngOnInit(): void {
    /*this.fichiers = this.tablesService.advanceTableData;
    this.advancedTable = this.fichiers*/
    this.getFiles();
  }
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
  public getFiles() {
    this.tablesService.getAllLogisticFiles()
      .subscribe(res => {
        this.files = res;
        this.copyFilesPerPagination = this.files;
        console.log('files', this.files)
        this.show = false;
        /*this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */
        this.advancedTable = this.files;
        console.log("advanced", this.advancedTable)
        this.copy_advancedTable = this.advancedTable; /***copy for filter */
        this.allTable = this.advancedTable; /****all content */

      },
        error => console.log(error));
  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.fichiers.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.advancedTable = this.sortByAttributeObject(this.fichiers, order, index);
  }
  public sortByAttributeObject(fichiers, order, index) {
    if (index == 0) {
      return this.sortByFichierOrder(fichiers, order, index);
    }
    else if (index == 1) {
      return this.sortByDateOrder(fichiers, order, index);
    }
    else if (index == 2) {
      return this.sortByClientOrder(fichiers, order, index);
    }
  }
  private sortByClientOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.nom_client > b.nom_client) {
        return 1 * order;
      }
      if (a.nom_client < b.nom_client) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }
  private sortByFichierOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.fichier > b.fichier) {
        return 1 * order;
      }
      if (a.fichier < b.fichier) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByDateOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.date_creation.slice(0, 10) > b.date_creation.slice(0, 10)) {
        return 1 * order;
      }
      if (a.date_creation.slice(0, 10) < b.date_creation.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  public changePage(page, force = false) {
    /*if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }*/
  }
  setFilteredItems() {
    /*this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }*/
  }

  filterItems(filterValue) {
    return this.fichiers.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
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
  public actualiser() {
    this.advancedTable = [];
    this.show = true;
    this.files = [];
    this.getFiles();
  }
  gotoDetails(row) {
    this.router.navigate(['/details-file-logistique', row.idLogisticFile])
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
    fileSource: new FormControl('', [Validators.required],),
  });
  selectedFiles: File = null;
  clients: any;
  snackBarRef: any;
  nbExpNotArchived: number;
  expediteurArray: any = [];
  expediteurArrayFiltred: any;

  constructor(private tablesService: MagistorService,
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
    this.snackBarRef = this._snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  openSnackbarListExpediteur() {
    /*this._snackBar.openFromComponent(SnackbarComponent, {
      panelClass: "snack-exp",
      verticalPosition: 'top',
      horizontalPosition: 'center',
      data: this.expediteurArrayFiltred
    });*/
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
    console.log("web service start");
    this.showloader = true;
    const formData = new FormData();
    formData.append('logisticFile', this.myForm.get('fileSource').value);
    this.tablesService.uploadLogisticFile(formData).subscribe(
      (res) => {
        this.showloader = false;
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        this.error = "Veuillez télécharger un fichier";
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}
