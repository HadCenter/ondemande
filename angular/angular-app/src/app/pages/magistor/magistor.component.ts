import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MagistorService } from './magistor.service';
import { MatDialog, MatDialogRef, } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
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
  fileTocheck: any;
  fileTovalidate:any;
  fileToInvalidate:any;
  snackBarRef: any;
  public snackAction = 'Ok';
  public errorValidation ="Un fichier de même type existe"
  fileToDownload: any;
  constructor(
    private tablesService: MagistorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) { }
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
    this.listenToWebSocket();
    this.getFiles();
  }
  listenToWebSocket() {
    this.tablesService.messages.subscribe(msg => {
      console.log("Response from websocket: ", JSON.parse(msg));
      //localStorage.setItem('wslogistic', JSON.stringify(JSON.parse(msg)));
      if(JSON.parse(msg).stateLogistic === "table logisticFile updated")
      {
        this.actualiser();
      }
    });
  }
  getColor(ch) {
    if (ch === 'à vérifier') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch.toLowerCase() === 'en cours') {
      return 'orange2 color-text--dark-gray';
    }else if (ch === 'En attente') {
      return 'amber color-text--dark-gray';
    }else if (ch === 'Validé') {
      return 'dark-green';
    } else {
      return 'red';
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBarRef = this._snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  public getFiles() {
    this.tablesService.getAllLogisticFiles()
      .subscribe(res => {
        this.files = res;
        this.copyFilesPerPagination = this.files;
        console.log('files', this.files)
        this.show = false;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */
       // this.advancedTable = this.files;
        console.log("advanced", this.advancedTable)
        this.copy_advancedTable = this.advancedTable; /***copy for filter */
        this.allTable = this.advancedTable; /****all content */

      },
        error => console.log(error));
  }
  

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
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  setFilteredItems() {
    this.copyFilesPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyFilesPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyFilesPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyFilesPerPagination.slice(0, this.countPerPage);
  }

  filterItems(filterValue) {
    let _filterValue = !filterValue.includes('/') ? filterValue : filterValue.split('/').join('-');
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(_filterValue.toLowerCase());
    });
  }
  /******Open dialog Import File */
  openDialog() {
    const dialogRef = this.dialog.open(DialogImportFile,{ panelClass: 'custom-modalbox'});
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.resetData();
        this.actualiser();
      }

    });
  }
  public resetData(){
    this.advancedTable = [];
    this.copy_advancedTable = [];
    this.files = [];
    this.show = true;

  }
  public actualiser() {
    // this.advancedTable = [];
    // this.copy_advancedTable = [];
    // this.files = [];
    // this.show = true;
    this.getFiles();
  }
  gotoDetails(row) {
    this.router.navigate(['/details-file-logistique', row.idLogisticFile])
  }
  validateFile(file){
    this.fileTovalidate = {
      logisticFileName: file.logisticFileName.name,
      folderLogisticFile: file.idLogisticFile,
      typeLogisticFile: file.logisticFileType
    }

    this.tablesService.validateFile(this.fileTovalidate).subscribe((res) => {
      if (res.message == "file validated successfully") {
        file.ButtonValidateActivated=false;
        file.ButtonCorrecteActiveted =true;
        file.ButtonInvalidateActivated = true;
        file.status ='en cours';
      }else if(res.message == "file validated echec"){
        this.openSnackBar(this.errorValidation,this.snackAction);
      }
    },
    (err) => {
      this.openSnackBar(this.errorValidation,this.snackAction);
    })
  }
  invalidateFile(file){
    this.fileToInvalidate = {
      logisticFileName: file.logisticFileName.name,
      idLogisticFile: file.idLogisticFile,
    }

    this.tablesService.invalidateFile(this.fileToInvalidate).subscribe((res) => {
      if (res.message == "file deleted successfully") {
        file.ButtonValidateActivated =true;
        file.ButtonCorrecteActiveted =false;
        file.ButtonInvalidateActivated =false;
        if(file.number_annomalies == 0){
          file.status ='En attente';
        }else {
          file.status ='à vérifier';
        }
      }
    },
    (err) => {
      file.ButtonValidateActivated=true;
      file.ButtonCorrecteActiveted =false;
      file.ButtonInvalidateActivated = false;
      if(file.number_annomalies == 0){
        file.status ='En attente';
      }else {
        file.status ='à vérifier';
      }    })
  }
  correctionFile(file) {
    this.fileTocheck = [{
      Magistor_Current_Client: file.clientName,
      Magistor_Current_File: file.logisticFileType.slice(0, 3),
      Magistor_File_Id: file.idLogisticFile.toString()
    }]
    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    console.warn("**file to check**", this.fileTocheck)
    this.tablesService.corretFile(this.fileTocheck).subscribe(res => {
      console.log('resultat correction', res);
      if (res.message == "ok") {
        this.actualiser();
      }
    })
  }

  downloadFile(file){
    this.fileToDownload ={
      logisticFileName: file.logisticFileName.name,
      folderLogisticFile: file.idLogisticFile
    }
    this.tablesService.downloadFile(this.fileToDownload) .subscribe(res => {
      saveAs(res, file.logisticFileName.name);
    }, error => console.log(error));

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
  public errorValidation = "Un fichier de même type existe"
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
    this.error = '';
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
    this.clicked=true;
    const formData = new FormData();
    formData.append('logisticFile', this.myForm.get('fileSource').value);
    this.tablesService.uploadLogisticFile(formData).subscribe(
      (res) => {
        this.showloader = false;
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        // this.myForm.reset();
        this.myForm.reset();

        if (err.error.message == "file save echec") {
          this.error = "Type de fichier incorrecte";
        }
        else if (err.error.message == "Client not found") {
          this.error = "Le client est introuvable";
        }
        else {
          this.error = "Veuillez télécharger un fichier";
        }
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}
