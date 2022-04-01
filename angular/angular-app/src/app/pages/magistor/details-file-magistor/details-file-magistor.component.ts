import { Component, OnInit, HostListener } from '@angular/core';
import { DetailsFileMagistorService } from './details-file-magistor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrestationErroneeService } from '../prestation-erronee/prestation-erronee.service';
import { MagistorService } from '../magistor.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}


@Component({
  selector: 'app-details-file-magistor',
  templateUrl: './details-file-magistor.component.html',
  styleUrls: ['./details-file-magistor.component.scss']
})
export class DetailsFileMagistorComponent implements OnInit {
  file: any;
  testFile: any = [];
  testFile2: any = [];
  testValidFile: any = [];
  testValidFile2: any = [];
  files: any = [];
  filesError: any = [];
  files2: any = [];
  filesValid: any = [];
  filesValid2: any = [];
  searchItems: any = [];
  filterValues: any = [];
  public filterValue: any;
  filterValue2: any;
  fileMagistor: any;
  errorfileMagistor: any;
  fileMagistor2: any;
  errorfileMagistor2: any;
  copyfileMagistor: any;
  copyerrorfileMagistor: any;
  copyfileMagistor2: any;
  copyerrorfileMagistor2: any;
  displayedColumns: any;
  displayedColumns2: any
  displayedColumnsError: any;
  displayedColumnsError2: any;
  public snackAction = 'Ok';
  public errorValidation = "Un fichier de même type existe"
  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  options: any = [];
  options2: any = [];
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  newCellValue: string = '';
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 0;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  fileTocheck: any;
  oneBloc: boolean;
  secondSheet: any;
  terminated: boolean = false;
  fileName: string;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];
  name_file: string;
  clickCorrection: boolean = false;
  correctedErrorfileMagistor: any;
  correctedErrorfileMagistor2: any;
  showLoader: boolean = true;
  correctClicked: boolean = false;
  validateClicked: boolean = false;
  dataChanged: boolean = false;
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  filterValues2: any = [];

  public currentPageValid = 1;
  private countPerPageValid = 5;
  public numPageValid = 1;
  public advancedTableValid = {};
  copyFilesValidPerPagination = [];

  public currentPageValid2 = 1;
  private countPerPageValid2 = 5;
  public numPageValid2 = 1;
  public advancedTableValid2 = {};
  copyFilesValidPerPagination2 = [];


  constructor(private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private fileService: DetailsFileMagistorService,
    private prestationService: PrestationErroneeService,
    private magistorService: MagistorService) { }

  ngOnInit(): void {
    this.fileService.getFile(this.route.snapshot.params.id).subscribe(
      resp => {
        this.file = resp;
        if (this.file.status == "En cours") {
          this.router.navigate(['/logistique']);
        }
        this.name_file = this.file.logisticFileName.name;
        if (this.file.logisticFileType == "ART01") {
          this.typeFileART = true;
          this.secondSheet = "CND01";
        }
        else if (this.file.logisticFileType == "REC01") {
          this.typeFileREC = true;
          this.secondSheet = "LRC01";
        }
        else if (this.file.logisticFileType == "CDC01") {
          this.typeFileCDC = true;
          this.secondSheet = "LCD01";
        }
        if (this.file.status == "En attente" || (this.file.status == "en cours" && this.file.number_annomalies == 0) || this.file.status == "Terminé") {
          this.oneBloc = true;
          this.fileName = this.file.logisticFileName.name;
        } else {
          this.oneBloc = false;
          this.fileName = this.file.logisticFileName.name;
          this.fileName = this.fileName.slice(0, 3) + this.fileName.slice(5);
          this.fileName = this.fileName.replace('.xlsx', '_Correct.xlsx')
        }
        if (this.file.status == "Terminé") {
          this.terminated = true;
        }


        this.getValidFiles();

        if (this.file.number_annomalies != 0) {
          this.getWrongFiles();

        }
      });
    this.listenToWebSocket();
  }

  listenToWebSocket() {
    this.magistorService.messages.subscribe(msg => {
      console.log("Response from websocket: ", JSON.parse(msg));
      if (JSON.parse(msg).stateLogistic === "table logisticFile updated") {
        this.actualiser2(this.file.status);

      }
    });
  }


  getValidFiles() {
    var data = {
      "logisticFileName": this.fileName,
      "folderLogisticFile": this.file.idLogisticFile,
      "logisticSheetName": this.file.logisticFileType,
    }

    this.fileService.getLogisticFileContent(data).subscribe(res => {
      this.fileMagistor = res;
      if (this.fileMagistor.rows.length > 0) {
        this.copyFilesValidPerPagination = this.fileMagistor;
        this.copyfileMagistor = JSON.parse(JSON.stringify(this.fileMagistor));
        this.copyfileMagistor.rows.splice(0, 0, this.copyfileMagistor.columns);
        this.copyfileMagistor = this.convertToArrayOfObjects(this.copyfileMagistor.rows);

        this.testValidFile = this.copyfileMagistor;   //copy to use on selection
        this.files = this.copyfileMagistor;    // copy to filter *

        this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
        this.advancedTableValid = this.getAdvancedTablePageValid(1, this.countPerPageValid); /****to display */

        this.displayedColumns = (Object.keys(this.copyfileMagistor[0]));

        this.LAST_EDITABLE_ROW = this.copyfileMagistor.length - 1;
        this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;

        // initialize all selectedCellsState to false
        this.copyfileMagistor.forEach(element => {
          this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
        });
        // get select options
        this.displayedColumns.forEach(item => {
          this.getOption(item);
        })
      }
    }
    )
    data = {
      "logisticFileName": this.fileName,
      "folderLogisticFile": this.file.idLogisticFile,
      "logisticSheetName": this.secondSheet,
    }
    this.fileService.getLogisticFileContent(data).subscribe(res => {
      this.fileMagistor2 = res;

      if (this.fileMagistor2.rows.length > 0) {
        this.copyFilesValidPerPagination2 = this.fileMagistor2;
        this.copyfileMagistor2 = JSON.parse(JSON.stringify(this.fileMagistor2));
        this.copyfileMagistor2.rows.splice(0, 0, this.copyfileMagistor2.columns);
        this.copyfileMagistor2 = this.convertToArrayOfObjects(this.copyfileMagistor2.rows);

        this.testValidFile2 = this.copyfileMagistor2;   //copy to use on selection
        this.files2 = this.copyfileMagistor2;    // copy to filter *
        this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
        this.advancedTableValid2 = this.getAdvancedTablePageValid2(1, this.countPerPageValid2); /****to display */

        this.displayedColumns2 = (Object.keys(this.copyfileMagistor2[0]));

        // get select options file Magistor 2
        this.displayedColumns2.forEach(item => {
          this.getOption2(item);
        })
      }
      if (this.file.number_annomalies == 0) {
        this.showLoader = false;
      }
    })

  }

  public getAdvancedTablePageValid(page, countPerPage) {
    let obj = {
      columns: this.fileMagistor.columns,
      rows: this.fileMagistor.rows.slice((page - 1) * countPerPage, page * countPerPage)
    }
    return obj

  }

  public getAdvancedTablePageValid2(page, countPerPage) {
    let obj = {
      columns: this.fileMagistor2.columns,
      rows: this.fileMagistor2.rows.slice((page - 1) * countPerPage, page * countPerPage)
    }
    return obj

  }

  public changePageValid(page, force = false) {
    if (page !== this.currentPageValid || force) {
      this.currentPageValid = page;
      this.advancedTableValid = this.getAdvancedTablePageValid(page, this.countPerPageValid);
    }
  }

  public changePageValid2(page, force = false) {
    if (page !== this.currentPageValid2 || force) {
      this.currentPageValid2 = page;
      this.advancedTableValid2 = this.getAdvancedTablePageValid2(page, this.countPerPageValid2);
    }
  }

  getWrongFiles() {
    this.fileName = this.file.logisticFileName.name;
    this.fileName = this.fileName.slice(0, 3) + this.fileName.slice(5);
    this.fileName = this.fileName.replace('.xlsx', '_Exceptions.xlsx')
    var data_error = {
      "logisticFileName": this.fileName,
      "folderLogisticFile": this.file.idLogisticFile,
      "logisticSheetName": this.file.logisticFileType,
    }
    this.fileService.getLogisticFileContent(data_error).subscribe(res => {
      this.errorfileMagistor = res;
      if (this.errorfileMagistor.rows.length > 0) {
        this.copyerrorfileMagistor = JSON.parse(JSON.stringify(this.errorfileMagistor));
        this.copyerrorfileMagistor.rows.splice(0, 0, this.copyerrorfileMagistor.columns);
        this.copyerrorfileMagistor = this.convertToArrayOfObjects(this.copyerrorfileMagistor.rows);
        this.correctedErrorfileMagistor = this.copyerrorfileMagistor;
        this.testFile = this.copyerrorfileMagistor;   //copy to use on selection
        this.filesError = this.copyerrorfileMagistor;    // copy to filter *
        this.displayedColumnsError = (Object.keys(this.copyerrorfileMagistor[0]));
        this.displayedColumnsError.unshift(this.displayedColumnsError.pop());
        this.LAST_EDITABLE_ROW = this.copyerrorfileMagistor.length - 1;
        this.LAST_EDITABLE_COL = this.displayedColumnsError.length - 1;

        // initialize all selectedCellsState to false
        this.copyerrorfileMagistor.forEach(element => {
          this.selectedCellsState.push(Array.from({ length: this.displayedColumnsError.length - 1 }, () => false))
        });
        // get select options
        // this.displayedColumnsError.forEach(item => {
        //  this.getOptionError(item);
        //})
      }
    })


    var data_error2 = {
      "logisticFileName": this.fileName,
      "folderLogisticFile": this.file.idLogisticFile,
      "logisticSheetName": this.secondSheet,

    }
    this.fileService.getLogisticFileContent(data_error2).subscribe(res => {
      this.errorfileMagistor2 = res;
      if (this.errorfileMagistor2.rows.length > 0) {
        this.copyerrorfileMagistor2 = JSON.parse(JSON.stringify(this.errorfileMagistor2));
        this.copyerrorfileMagistor2.rows.splice(0, 0, this.copyerrorfileMagistor2.columns);
        this.copyerrorfileMagistor2 = this.convertToArrayOfObjects(this.copyerrorfileMagistor2.rows);
        this.displayedColumnsError2 = (Object.keys(this.copyerrorfileMagistor2[0]));
        this.displayedColumnsError2.unshift(this.displayedColumnsError2.pop());
        this.correctedErrorfileMagistor2 = this.copyerrorfileMagistor2;
      }
      this.showLoader = false;
    })
  }

  actualiser() {
    this.showLoader = true;
    this.dataChanged = false;
    this.fileMagistor = undefined;
    this.errorfileMagistor = undefined;
    this.fileMagistor2 = undefined;
    this.errorfileMagistor2 = undefined;
    if (this.file.status == "En attente" || (this.file.status == "en cours" && this.file.number_annomalies == 0) || this.file.status == "Terminé") {
      this.oneBloc = true;
      this.fileName = this.file.logisticFileName.name;
    } else {
      this.oneBloc = false;
      this.fileName = this.file.logisticFileName.name;
      this.fileName = this.fileName.slice(0, 3) + this.fileName.slice(5);
      this.fileName = this.fileName.replace('.xlsx', '_Correct.xlsx')
    }
    if (this.file.status == "Terminé") {
      this.terminated = true;
    }
    this.getValidFiles();

    if (this.file.number_annomalies != 0) {
      this.getWrongFiles();

    }

  }
  actualiser2(previousFileStatus: string) {
    //this.showLoader = true;
    this.dataChanged = false;

    this.fileService.getFile(this.route.snapshot.params.id).subscribe(
      resp => {
        this.file = resp;
        if (this.file.status != previousFileStatus) {
          this.showLoader = true;
        }
        if (this.file.status == "En cours") {
          this.router.navigate(['/logistique']);
        }

        if (this.file.logisticFileType == "ART01") {
          this.typeFileART = true;
          this.secondSheet = "CND01";
        }
        else if (this.file.logisticFileType == "REC01") {
          this.typeFileREC = true;
          this.secondSheet = "LRC01";
        }
        else if (this.file.logisticFileType == "CDC01") {
          this.typeFileCDC = true;
          this.secondSheet = "LCD01";
        }
        if (this.file.status == "En attente" || (this.file.status == "en cours" && this.file.number_annomalies == 0) || this.file.status == "Terminé") {
          this.oneBloc = true;
          this.fileName = this.file.logisticFileName.name;
        } else {
          this.oneBloc = false;
          this.fileName = this.file.logisticFileName.name;
          this.fileName = this.fileName.slice(0, 3) + this.fileName.slice(5);
          this.fileName = this.fileName.replace('.xlsx', '_Correct.xlsx')
        }
        if (this.file.status == "Terminé") {
          this.terminated = true;
        }

        this.getValidFiles();

        if (this.file.number_annomalies != 0) {
          this.getWrongFiles();
        }
      })
  }

  getColor(ch) {
    if (ch === 'à vérifier') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch.toLowerCase() === 'en cours') {
      return 'orange2 color-text--dark-gray';
    } else if (ch === 'En attente') {
      return 'amber color-text--dark-gray';
    } else if (ch === 'Validé') {
      return 'dark-green';
    } else {
      return 'red';
    }
  }

  /**
    * Get options inside selects
    * @param filter
    */
  getOption(filter) {
    let options = [];
    options = this.testValidFile.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {

      return options.indexOf(value) == index && value !== "";
    });
    this.displayedColumns.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj);
      }
    })
  }

  getOption2(filter) {
    let options = [];
    options = this.testValidFile2.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {

      return options.indexOf(value) == index && value !== "";
    });
    this.displayedColumns2.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options2.push(obj);
      }
    })
  }

  /**
    * Get options inside selects
    * @param filter
    */
  getOptionError(filter) {
    let options = [];
    options = this.testFile.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {

      return options.indexOf(value) == index && value !== "";
    });
    this.displayedColumnsError.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj);
      }
    })
  }
  getOptionError2(filter) {
    let options = [];
    options = this.testFile2.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {

      return options.indexOf(value) == index && value !== "";
    });
    this.displayedColumnsError2.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options2.push(obj);
      }
    })
  }

  /**** Filter items on valid file */
  setFilteredItemsValid() {
    this.copyfileMagistor = this.filterItemsValid(this.filterValue);
    if (this.copyfileMagistor.length >= 1) {
      this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

      this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
      this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
      this.advancedTableValid = {
        columns: this.fileMagistor.columns,
        rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
      }
    }
    else {
      this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);
      this.advancedTableValid = {
        columns: this.fileMagistor.columns,
        rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
      }
    }
    if (this.filterValue === '') {
      this.copyfileMagistor = this.copyfileMagistor;
      this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

      this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
      this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
      this.advancedTableValid = {
        columns: this.fileMagistor.columns,
        rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
      }
    }
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

  filterItemsValid(filterValue: string) {
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }


  /**** Filter items on valid file */
  setFilteredItemsValid2() {
    this.copyfileMagistor2 = this.filterItemsValid2(this.filterValue2);
    if (this.copyfileMagistor2.length >= 1) {
      this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);

      this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
      this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
      this.advancedTableValid2 = {
        columns: this.fileMagistor2.columns,
        rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
      }
    }
    else {
      this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2);
      this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
      this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
      this.advancedTableValid2 = {
        columns: this.fileMagistor2.columns,
        rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
      }
    }
    if (this.filterValue2 === '') {
      this.copyfileMagistor2 = this.copyfileMagistor2;
      this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);

      this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
      this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
      this.advancedTableValid2 = {
        columns: this.fileMagistor2.columns,
        rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
      }
    }
  }



  filterItemsValid2(filterValue2: string) {
    return this.files2.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue2.toLowerCase());
    });
  }


  getIntersection2(filter) {
    return this.copyfileMagistor2.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }


  getIntersection(filter) {
    return this.copyfileMagistor.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  filterChange(filter) {
    //  this.initSelectedCells();     // init selected cells
    this.filesValid = this.testValidFile.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);

    return this.filesValid.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }

  filterChange2(filter) {
    //  this.initSelectedCells();     // init selected cells
    this.filesValid2 = this.testValidFile2.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.filesValid2.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }

  /**
* change color of the selected column header on file livraison
*/
  changeSelectedOptionColor(filter) {
    if (filter.columnProp && filter.modelValue != "") {
      document.getElementById(filter.columnProp).style.color = "#00bcd4";
    }
    else {
      document.getElementById(filter.columnProp).style.color = "white";
    }
  }

  changeSelectedOptionColor2(filter) {
    if (filter.columnProp && filter.modelValue != "") {
      document.getElementById(filter.columnProp + "2").style.color = "#00bcd4";
    }
    else {
      document.getElementById(filter.columnProp + "2").style.color = "white";
    }
  }


  /**
      * Update table's dataSource
      * @param text
      */
  updateSelectedCellsValues(text: string) {

    if (text == null) { return; }

    if (this.tableMouseDown && this.tableMouseUp) {
      if (this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {
        //convert every rows to object
        const dataCopy = this.copyfileMagistor.slice();// copy and mutate
        let startCol: number;
        let endCol: number;
        let startRow: number;
        let endRow: number;

        if (this.tableMouseDown.colId <= this.tableMouseUp.colId) {
          startCol = this.tableMouseDown.colId;
          endCol = this.tableMouseUp.colId;
        } else {
          endCol = this.tableMouseDown.colId;
          startCol = this.tableMouseUp.colId;
        }

        if (this.tableMouseDown.rowId <= this.tableMouseUp.rowId) {
          startRow = this.tableMouseDown.rowId;
          endRow = this.tableMouseUp.rowId;
        } else {
          endRow = this.tableMouseDown.rowId;
          startRow = this.tableMouseUp.rowId;
        }

        //--Edit cells from the same column
        if (startCol === endCol) {
          console.log('--Edit cells from the same column', startCol);
          for (let i = startRow; i <= endRow; i++) {
            //change color after modify value
            this.copyfileMagistor.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.fileMagistor.columns[startCol]]) {    // TO IMPROVE
                  var column = this.fileMagistor.columns[startCol];
                  var container = document.querySelectorAll<HTMLElement>("#" + column + "magistor");
                  container[index].style.setProperty("color", "green", "important");
                }
              }
            });
            dataCopy[i][this.fileMagistor.columns[startCol]] = text;
          }
        } else {
          //--Edit cells starting and ending not on the same column
          console.log('--Edit cells starting and ending not on the same column');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.fileMagistor.columns[j]] = text;
            }
          }
        }
        console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyfileMagistor = dataCopy;
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé');
      }
    }
  }

  /**
    * @param rowId
    * @param colId
    * @param cellsType
    */
  onMouseDown(rowId: number, colId: number, cellsType: string) {
    if (this.clickCorrection == false) {
      this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
    }
    else {  //disable click after click correction
      return false;
    }

  }

  /**
   * @param rowId
   * @param colId
   * @param cellsType
   */
  onMouseUp(rowId: number, colId: number, cellsType: string) {
    if (this.clickCorrection == false) {
      this.tableMouseUp = { rowId: rowId, colId: colId, cellsType: cellsType };
      if (this.tableMouseDown) {
        this.newCellValue = '';
        this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
      }
    }
    else {  //disable click after click correction
      return false;
    }
  }

  /**
   * Update selectedCols && selectedRows arrays
   * @param mouseDownColId
   * @param mouseUpColId
   * @param mouseDownRowId
   * @param mouseUpRowId
   */
  private updateSelectedCellsState(mouseDownColId: number, mouseUpColId: number, mouseDownRowId: number, mouseUpRowId: number) {
    // init selected cells
    this.initSelectedCells();
    // update selected cells
    let startCol: number;
    let endCol: number;
    let startRow: number;
    let endRow: number;
    if (mouseDownColId <= mouseUpColId) {
      startCol = mouseDownColId;
      endCol = mouseUpColId;
    } else {
      endCol = mouseDownColId;
      startCol = mouseUpColId;
    }

    if (mouseDownRowId <= mouseUpRowId) {
      startRow = mouseDownRowId;
      endRow = mouseUpRowId;
    } else {
      endRow = mouseDownRowId;
      startRow = mouseUpRowId;
    }
    for (let i = startRow; i <= endRow; i++) {
      for (let j = startCol; j <= endCol; j++) {
        this.selectedCellsState[i][j] = true;
      }
    }
  }


  /**
   * Reset filter
   */
  resetFiltre2() {
    const rows = document.getElementsByClassName('details-line2') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.color = 'white';
    }
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
    // reset the selected filtre
    this.options2.forEach(element => {
      if (element.hasOwnProperty("modelValue")) {
        element.modelValue = ""
      }
    });
    this.filterValues2 = [];
    this.copyfileMagistor2 = this.testValidFile2;
    this.copyfileMagistor2 = this.copyfileMagistor2.sort((a, b) => (a.OP_CODE > b.OP_CODE) ? 1 : -1);
    if (this.copyfileMagistor2.length >= 1) {
      this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
      this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
      this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
      this.advancedTableValid2 = {
        columns: this.fileMagistor2.columns,
        rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
      }
    }
    else {
      this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2);
      this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
      this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
      this.advancedTableValid2 = {
        columns: this.fileMagistor2.columns,
        rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
      }
    }


  }




  /**
  * Reset filter
  */
  resetFiltre() {
    const rows = document.getElementsByClassName('details-line') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.color = 'white';
    }
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
    // reset the selected filtre
    this.options.forEach(element => {
      if (element.hasOwnProperty("modelValue")) {
        element.modelValue = ""
      }
    });
    this.filterValues = [];
    this.copyfileMagistor = this.testValidFile;
    this.copyfileMagistor = this.copyfileMagistor.sort((a, b) => (a.OP_CODE > b.OP_CODE) ? 1 : -1);
    if (this.copyfileMagistor.length >= 1) {
      this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);
      this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
      this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
      this.advancedTableValid = {
        columns: this.fileMagistor.columns,
        rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
      }
    }
    else {
      this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns)
    }
    this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
    this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
    this.advancedTableValid = {
      columns: this.fileMagistor.columns,
      rows: this.fileMagistor?.rows.slice(0, this.countPerPageValid)
    }
  }


  /**
* Initialise the selected cells
*/
  initSelectedCells() {
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
  }

  /**
   * After the user enters a new value, all selected cells must be updated
   * document:keyup
   * @param event
   */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {

    // If no cell is selected then ignore keyUp event
    if (this.tableMouseDown && this.tableMouseUp) {

      let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
        'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
        'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
        'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

      if (event.key === 'Backspace') { // 'delete' key is pressed
        const end: number = this.newCellValue.length - 1;
        this.newCellValue = this.newCellValue.slice(0, end);

      } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
        this.newCellValue += event.key;
      }
      this.updateSelectedCellsValues(this.newCellValue);
    }
  }

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  convertArrayofObjectsToEmptyRows(displayedColumns) {
    let output = {
      columns: displayedColumns,
      rows: [],

    }
    return output;
  }
  convertArrayofObjectToRowsColumns(arrayOfObject) {

    let output = {
      columns: (Object.keys(arrayOfObject[0])),
      rows: arrayOfObject.reduce((acc, obj) => [...acc, Object.values(obj).map(y => y)], []),
    }
    return output;
  }
  setFilteredItemsOptions(filter) {

    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);
    if (filterExists == false) { this.filterValues.push(filter) }

    // if check and not uncheck
    if (filter.modelValue.length !== 0) {
      // if only one select is selected
      if (this.filterValues.length == 1) {
        this.copyfileMagistor = this.filterChange(filter);
        if (this.copyfileMagistor.length >= 1) {
          this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

        }
        else {
          this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);

        }
        this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
        this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
        this.advancedTableValid = {
          columns: this.fileMagistor.columns,
          rows: this.fileMagistor?.rows.slice(0, this.countPerPageValid)
        }

      } else {
        // if already another select is active merge the results
        if (filterExists == false) {
          this.copyfileMagistor = this.getIntersection(filter)
          if (this.copyfileMagistor.length >= 1) {
            this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

          }
          else {
            this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);

          }
          this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
          this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
          this.advancedTableValid = {
            columns: this.fileMagistor.columns,
            rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
          }

        } else {
          this.copyfileMagistor = this.filesValid;
          this.filterValues.forEach(element => {
            this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));
          });
          this.copyfileMagistor = this.copyfileMagistor.filter((object, index) => index === this.copyfileMagistor.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
          if (this.copyfileMagistor.length >= 1) {
            this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

          }
          else {
            this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);

          }
          this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
          this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
          this.advancedTableValid = {
            columns: this.fileMagistor.columns,
            rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
          }

        }
      }
    }
    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {
      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues.length == 0) {
        this.copyfileMagistor = this.testValidFile;
        this.copyfileMagistor = this.copyfileMagistor.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
        if (this.copyfileMagistor.length >= 1) {

          this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

        }
        else {
          this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);

        }
        this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
        this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
        this.advancedTableValid = {
          columns: this.fileMagistor.columns,
          rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
        }

      }
      else if (this.filterValues.length == 1) {
        this.copyfileMagistor = this.filterChange(this.filterValues[0]);
        if (this.copyfileMagistor.length >= 1) {
          this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

        }
        else {
          this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);

        }
        this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
        this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
        this.advancedTableValid = {
          columns: this.fileMagistor.columns,
          rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
        }

      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.copyfileMagistor = this.testValidFile;
        this.filterValues.forEach(element => {
          this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));

          // this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
          // this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
          // this.advancedTableValid = {
          //   columns: this.fileMagistor.columns,
          //   rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
          // }
        });
        if (this.copyfileMagistor.length >= 1) {
          this.fileMagistor = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor);

        }
        else {
          this.fileMagistor = this.convertArrayofObjectsToEmptyRows(this.displayedColumns);
        }
        this.currentPageValid = this.fileMagistor.rows.length > 0 ? 1 : 0;
        this.numPageValid = Math.ceil(this.fileMagistor.rows.length / this.countPerPageValid);
        this.advancedTableValid = {
          columns: this.fileMagistor.columns,
          rows: this.fileMagistor.rows.slice(0, this.countPerPageValid)
        }
      }
    }

  }

  setFilteredItemsOptions2(filter) {

    // check if filter is already selected
    const filterExists = this.filterValues2.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor2(filter);
    if (filterExists == false) { this.filterValues2.push(filter) }


    // if check and not uncheck
    if (filter.modelValue.length !== 0) {
      // if only one select is selected
      if (this.filterValues2.length == 1) {
        this.copyfileMagistor2 = this.filterChange2(filter);
        if (this.copyfileMagistor2.length >= 1) {
          this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
        }
        else {
          this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
        }

        this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
        this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
        this.advancedTableValid2 = {
          columns: this.fileMagistor2.columns,
          rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
        }

      } else {
        // if already another select is active merge the results
        if (filterExists == false) {
          this.copyfileMagistor2 = this.getIntersection2(filter)
          if (this.copyfileMagistor2.length >= 1) {
            this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
          }
          else {
            this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
          }

          this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
          this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
          this.advancedTableValid2 = {
            columns: this.fileMagistor2.columns,
            rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
          }

        } else {
          this.copyfileMagistor2 = this.filesValid2;
          this.filterValues2.forEach(element => {
            this.copyfileMagistor2 = this.copyfileMagistor2.filter(x => element.modelValue.includes(x[element.columnProp]));
          });
          this.copyfileMagistor2 = this.copyfileMagistor2.filter((object, index) => index === this.copyfileMagistor2.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
          if (this.copyfileMagistor2.length >= 1) {
            this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
          }
          else {
            this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
          }
          this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
          this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
          this.advancedTableValid2 = {
            columns: this.fileMagistor2.columns,
            rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
          }
        }
      }
    }
    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {
      this.filterValues2 = this.filterValues2.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues2.length == 0) {
        this.copyfileMagistor2 = this.testValidFile2;
        this.copyfileMagistor2 = this.copyfileMagistor2.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
        if (this.copyfileMagistor2.length >= 1) {
          this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
        }
        else {
          this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
        }
        this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
        this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
        this.advancedTableValid2 = {
          columns: this.fileMagistor2.columns,
          rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
        }
      }
      else if (this.filterValues2.length == 1) {
        this.copyfileMagistor2 = this.filterChange2(this.filterValues2[0]);
        if (this.copyfileMagistor2.length >= 1) {
          this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
        }
        else {
          this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
        }
        this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
        this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
        this.advancedTableValid2 = {
          columns: this.fileMagistor2.columns,
          rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
        }
      }
      else {
        this.filterValues2 = this.filterValues2.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.copyfileMagistor2 = this.testValidFile2;
        this.filterValues2.forEach(element => {
          this.copyfileMagistor2 = this.copyfileMagistor2.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        if (this.copyfileMagistor2.length >= 1) {
          this.fileMagistor2 = this.convertArrayofObjectToRowsColumns(this.copyfileMagistor2);
        }
        else {
          this.fileMagistor2 = this.convertArrayofObjectsToEmptyRows(this.displayedColumns2)
        }
        this.currentPageValid2 = this.fileMagistor2.rows.length > 0 ? 1 : 0;
        this.numPageValid2 = Math.ceil(this.fileMagistor2.rows.length / this.countPerPageValid2);
        this.advancedTableValid2 = {
          columns: this.fileMagistor2.columns,
          rows: this.fileMagistor2.rows.slice(0, this.countPerPageValid2)
        }
      }
    }

  }

  convertToArrayOfObjects(data) {
    var keys = data.shift(),
      i = 0, k = 0,
      obj = null,
      output = [];
    for (i = 0; i < data.length; i++) {
      obj = {};
      for (k = 0; k < keys.length; k++) {
        obj[keys[k]] = data[i][k];
      }
      output.push(obj);
    }
    return output;
  }


  /**
   * Correct the file
   */
  //   NOT USED
  // correctAndValidateFile() {
  //   this.showLoader = true;

  //   var errorFile1;
  //   var errorFile2;
  //   var columns, columns2;
  //   if (this.oneBloc) {
  //     columns = this.fileMagistor['columns'];
  //     columns2 = this.fileMagistor2['columns'];
  //     if (this.correctedErrorfileMagistor == undefined) {
  //       this.correctedErrorfileMagistor = this.copyfileMagistor;
  //     }
  //     if (this.correctedErrorfileMagistor2 == undefined) {
  //       this.correctedErrorfileMagistor2 = this.copyfileMagistor2;
  //     }

  //   } else {
  //     columns = this.errorfileMagistor['columns'];
  //     columns2 = this.errorfileMagistor2['columns'];
  //     if (this.correctedErrorfileMagistor == undefined) {
  //       this.correctedErrorfileMagistor = [];
  //     }
  //     if (this.correctedErrorfileMagistor2 == undefined) {
  //       this.correctedErrorfileMagistor2 = [];
  //     }

  //   }
  //   console.log(columns);
  //   console.log(columns2);

  //   console.log(this.correctedErrorfileMagistor);
  //   console.log(this.correctedErrorfileMagistor2);



  //   errorFile1 = this.correctedErrorfileMagistor.map(Object.values);
  //   errorFile2 = this.correctedErrorfileMagistor2.map(Object.values);

  //   this.fileTocheck = {
  //     fileId: this.file.idLogisticFile,
  //     columns1: columns,
  //     rows1error: errorFile1,
  //     columns2: columns2,
  //     rows2error: errorFile2,
  //   };
  //   //console.log("copy rows : ", this.copyfileMagistor.map(Object.values));
  //   this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
  //   console.warn("**file to check**", this.fileTocheck);
  //   this.fileService.correctAndValidateLogisticFile(this.fileTocheck).subscribe(res => {
  //     console.log('resultat correction', res);
  //     if (res.message == "file validated successfully") {
  //       this.actualiser2();
  //     }
  //   })
  // }

  /**
   * Save modificatiosn on file and place it in folder IN if it's already validated
   */
  saveModificationsOnFile() {
    this.showLoader = true;
    this.dataChanged = false;
    var errorFile1;
    var errorFile2;
    var columns, columns2;
    if (this.oneBloc) {
      columns = this.fileMagistor['columns'];
      columns2 = this.fileMagistor2['columns'];
      if (this.correctedErrorfileMagistor == undefined) {
        this.correctedErrorfileMagistor = this.copyfileMagistor;
      }
      if (this.correctedErrorfileMagistor2 == undefined) {
        this.correctedErrorfileMagistor2 = this.copyfileMagistor2;
      }
    } else {
      columns = this.errorfileMagistor['columns'];
      columns2 = this.errorfileMagistor2['columns'];
      if (this.correctedErrorfileMagistor == undefined) {
        this.correctedErrorfileMagistor = [];
      }
      if (this.correctedErrorfileMagistor2 == undefined) {
        this.correctedErrorfileMagistor2 = [];
      }
    }

    errorFile1 = this.correctedErrorfileMagistor.map(Object.values);
    errorFile2 = this.correctedErrorfileMagistor2.map(Object.values);

    this.fileTocheck = {
      fileId: this.file.idLogisticFile,
      columns1: columns,
      rows1error: errorFile1,
      columns2: columns2,
      rows2error: errorFile2,
    };
    //console.log("copy rows : ", this.copyfileMagistor.map(Object.values));
    this.openSnackBar("Demande de modification envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    console.warn("**file to check**", this.fileTocheck);
    if (this.file.status == "en cours") {
      this.fileService.correctAndValidateLogisticFile(this.fileTocheck).subscribe(res => {
        if (res.message == "file validated successfully") {
          this.showLoader = true;
          this.actualiser2(this.file.status);
        }
      })
    } else {
      this.fileService.correctLogisticFile(this.fileTocheck).subscribe(res => {
        if (res.message == "success") {
          this.actualiser();
        }
      })
    }
  }

  validateFile() {
    this.validateClicked = true;
    this.openSnackBar("Validation du fichier en cours...", this.snackAction);

    var fileTovalidate = {
      logisticFileName: this.file.logisticFileName.name,
      folderLogisticFile: this.file.idLogisticFile,
      typeLogisticFile: this.file.logisticFileType
    }

    this.magistorService.validateFile(fileTovalidate).subscribe((res) => {
      if (res.message == "file validated successfully") {
        this.file.ButtonValidateActivated = false;
        this.file.ButtonCorrecteActiveted = true;
        this.file.ButtonInvalidateActivated = true;
        this.file.status = 'en cours';
      } else if (res.message == "file validated echec") {
        this.openSnackBar(this.errorValidation, this.snackAction);
        this.validateClicked = true;
      }
    },
      (err) => {
        this.openSnackBar(this.errorValidation, this.snackAction);
        this.validateClicked = false;

      })
  }
  invalidateFile() {
    this.openSnackBar("Dévalidation du fichier en cours...", this.snackAction);

    var fileToInvalidate = {
      logisticFileName: this.file.logisticFileName.name,
      idLogisticFile: this.file.idLogisticFile,
    }

    this.magistorService.invalidateFile(fileToInvalidate).subscribe((res) => {
      if (res.message == "file deleted successfully") {
        this.file.ButtonValidateActivated = true;
        this.file.ButtonCorrecteActiveted = false;
        this.file.ButtonInvalidateActivated = false;
        this.validateClicked = false;
        if (this.file.number_annomalies == 0) {
          this.file.status = 'En attente';
        } else {
          this.file.status = 'à vérifier';
        }
      }
    },
      (err) => {
        this.file.ButtonValidateActivated = true;
        this.file.ButtonCorrecteActiveted = false;
        this.file.ButtonInvalidateActivated = false;
        this.validateClicked = false;
        if (this.file.number_annomalies == 0) {
          this.file.status = 'En attente';
        } else {
          this.file.status = 'à vérifier';
        }
      })
  }
  correctionFile() {
    this.correctClicked = true;
    this.fileTocheck = [{
      Magistor_Current_Client: this.file.clientName,
      Magistor_Current_File: this.file.logisticFileType.slice(0, 3),
      Magistor_File_Id: this.file.idLogisticFile.toString()
    }]
    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    console.warn("**file to check**", this.fileTocheck)
    this.fileService.corretFile(this.fileTocheck).subscribe(res => {
      console.log('resultat correction', res);
      if (res.message == "ok") {
        this.router.navigate(['/logistique']);
      }
    })
  }


  /**
     * Hide ui selection red rectangle
     */
  hideUiSelectionOnCorrection() {
    if (document.querySelector('.selected')) {
      var inputs = document.querySelectorAll(".selected");
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('selected');
      }
    }
  }

  onMouseDownAll() {
    //   console.log("mouse all happend");
    //   if (document.querySelector('td.selected') !== null) {
    //     document.querySelector('td.selected').classList.remove('selected');
    //   this.prestationService.settableMouseDown2(undefined);
    //   this.prestationService.settableMouseDown(undefined);
    //   this.prestationService.settableMouseUp2(undefined);
    //   this.prestationService.settableMouseUp(undefined);
    //   }

  }

  changedData(data: any) {
    this.correctedErrorfileMagistor = data;
    if (!this.dataChanged) {
      this.dataChanged = true;
    }
  }

  changedData2(data: any) {
    this.correctedErrorfileMagistor2 = data;
    if (!this.dataChanged) {
      this.dataChanged = true;
    }

  }
  openConfirmDialog(decision) {
    if (!this.dataChanged) {
      if (decision == 'valider') {
        this.validateFile();
      } else if (decision == 'corriger') {
        this.correctionFile();
      }

    }
    else {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        disableClose: false
      });
      if (decision == 'valider') {
        this.dialogRef.componentInstance.confirmMessage = "Voulez-vous valider le ficher sans l'enregistrer ?"
      } else if (decision == 'corriger') {
        this.dialogRef.componentInstance.confirmMessage = "Voulez-vous corriger le ficher sans l'enregistrer ?"
      }
      this.dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (decision == 'valider') {
            this.validateFile();
          } else if (decision == 'corriger') {
            this.correctionFile();
          }
        }
        this.dialogRef = null;
      });
    }
  }
}
