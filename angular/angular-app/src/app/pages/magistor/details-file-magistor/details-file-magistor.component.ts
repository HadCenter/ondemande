import { Component, OnInit } from '@angular/core';
import { DetailsFileMagistorService } from './details-file-magistor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  file: any = [];
  testFile: any = [];
  files: any = [];
  searchItems: any = [];
  filterValues: any = [];
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
  public snackAction = 'Ok';
  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  options: any = [];
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
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];

  clickCorrection: boolean = false;
  constructor(private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public router: Router,
    private fileService: DetailsFileMagistorService) { }

  ngOnInit(): void {
    this.fileService.getFile(this.route.snapshot.params.id).subscribe(
      resp => {
        this.file = resp;
        var data;
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
        if (this.file.status == "En attente" || this.file.status == "Validé" || this.file.status == "Terminé") {
          this.oneBloc = true;
          console.log(this.oneBloc);
          data = {
            "logisticFileName": this.file.logisticFileName.name,
            "folderLogisticFile": this.file.idLogisticFile,
            "logisticSheetName": this.file.logisticFileType,
          }
        } else {
          this.oneBloc = false;
          var fileName = this.file.logisticFileName.name;
          fileName = fileName.slice(0, 3) + fileName.slice(5);
          data = {
            "logisticFileName": fileName.replace('.xlsx', '_Correct.xlsx'),
            "folderLogisticFile": this.file.idLogisticFile,
            "logisticSheetName": this.file.logisticFileType,
          }
        }
        if (this.file.status == "Terminé") {
          this.terminated = true;
        }
        console.log(data);
        this.fileService.getLogisticFileContent(data).subscribe(res => {
          this.fileMagistor = res;
          console.log(this.fileMagistor.rows);
          if (this.fileMagistor.rows.length > 0) {
            this.copyfileMagistor = JSON.parse(JSON.stringify(this.fileMagistor));
            this.copyfileMagistor.rows.splice(0, 0, this.copyfileMagistor.columns);
            this.copyfileMagistor = this.convertToArrayOfObjects(this.copyfileMagistor.rows);
            this.testFile = this.copyfileMagistor;   //copy to use on selection
            this.files = this.copyfileMagistor;    // copy to filter *
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
          "logisticFileName": this.file.logisticFileName.name,
          "folderLogisticFile": this.file.idLogisticFile,
          "logisticSheetName": this.secondSheet,
        }
        console.log(data);
        this.fileService.getLogisticFileContent(data).subscribe(res => {
          this.fileMagistor2 = res;
          console.log(this.fileMagistor2.rows);
          if (this.fileMagistor2.rows.length > 0) {
            this.copyfileMagistor2 = JSON.parse(JSON.stringify(this.fileMagistor2));
            this.copyfileMagistor2.rows.splice(0, 0, this.copyfileMagistor2.columns);
            this.copyfileMagistor2 = this.convertToArrayOfObjects(this.copyfileMagistor2.rows);
            //this.displayedColumns2 = (Object.keys(this.copyfileMagistor2[0]));
          }
        })



        if (this.file.number_annomalies != 0) {
          var fileName = this.file.logisticFileName.name;
          fileName = fileName.slice(0, 3) + fileName.slice(5);
          var data_error = {
            "logisticFileName": fileName.replace('.xlsx', '_Exceptions.xlsx'),
            "folderLogisticFile": this.file.idLogisticFile,
            "logisticSheetName": this.file.logisticFileType,

          }
          this.fileService.getLogisticFileContent(data_error).subscribe(res => {
            this.errorfileMagistor = res;

            if (this.errorfileMagistor.rows.length > 0) {
              this.copyerrorfileMagistor = JSON.parse(JSON.stringify(this.errorfileMagistor));
              this.copyerrorfileMagistor.rows.splice(0, 0, this.copyerrorfileMagistor.columns);
              this.copyerrorfileMagistor = this.convertToArrayOfObjects(this.copyerrorfileMagistor.rows);
              this.testFile = this.copyerrorfileMagistor;   //copy to use on selection
              this.files = this.copyerrorfileMagistor;    // copy to filter *
              this.displayedColumns = (Object.keys(this.copyerrorfileMagistor[0]));
              this.displayedColumns.unshift(this.displayedColumns.pop());
              this.LAST_EDITABLE_ROW = this.copyerrorfileMagistor.length - 1;
              this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;

              // initialize all selectedCellsState to false
              this.copyerrorfileMagistor.forEach(element => {
                this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
              });
              // get select options
              this.displayedColumns.forEach(item => {
                this.getOption(item);
              })
            }
          })


          var data_error2 = {
            "logisticFileName": fileName.replace('.xlsx', '_Exceptions.xlsx'),
            "folderLogisticFile": this.file.idLogisticFile,
            "logisticSheetName": this.secondSheet,

          }
          this.fileService.getLogisticFileContent(data_error2).subscribe(res => {
            this.errorfileMagistor2 = res;

            if (this.errorfileMagistor2.rows.length > 0) {
              this.copyerrorfileMagistor2 = JSON.parse(JSON.stringify(this.errorfileMagistor2));
              this.copyerrorfileMagistor2.rows.splice(0, 0, this.copyerrorfileMagistor2.columns);
              this.copyerrorfileMagistor2 = this.convertToArrayOfObjects(this.copyerrorfileMagistor2.rows);
              this.displayedColumns2 = (Object.keys(this.copyerrorfileMagistor2[0]));
              this.displayedColumns2.unshift(this.displayedColumns2.pop());
            }
            console.log(this.errorfileMagistor2);
          })

        }
      })
  }

  /**
    * Get options inside selects
    * @param filter
    */
  getOption(filter) {
    let options = [];
    options = this.testFile.map((item) => item[filter]);
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


  /**** Filter items on valid file */
  setFilteredItemsValid() {
    this.copyfileMagistor = this.filterItemsValid(this.searchItems);
    if (this.searchItems === '') {
      this.copyfileMagistor = this.copyfileMagistor;
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





  getIntersection(filter) {
    return this.copyfileMagistor.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  filterChange(filter) {
    //  this.initSelectedCells();     // init selected cells
    this.files = this.files.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.files.filter(function (item) {
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
  resetFiltre() {
    const rows = document.getElementsByClassName('titre-column-magistor') as HTMLCollectionOf<HTMLElement>;
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
    this.copyfileMagistor = this.testFile;
    this.copyfileMagistor = this.copyfileMagistor.sort((a, b) => (a.OP_CODE > b.OP_CODE) ? 1 : -1);
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
  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.copyfileMagistor = this.filterChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.copyfileMagistor = this.getIntersection(filter)
      }
      else {
        this.copyfileMagistor = this.files;
        this.filterValues.forEach(element => {
          this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.copyfileMagistor = this.copyfileMagistor.filter((object, index) => index === this.copyfileMagistor.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues.length == 0) {
        this.copyfileMagistor = this.testFile;
        this.copyfileMagistor = this.copyfileMagistor.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValues.length == 1) {
        this.copyfileMagistor = this.filterChange(this.filterValues[0])
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.copyfileMagistor = this.testFile;
        this.filterValues.forEach(element => {
          this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
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
  correctionFile() {
    this.clickCorrection = true;
    // var user = JSON.parse(localStorage.getItem('currentUser'));
    //console.error(user);
    //console.error(this.file);
    this.hideUiSelectionOnCorrection();  //hide ui selection on correction
    // if (this.copyfileMagistor.rows.length > 0) {
    this.fileTocheck = [{
      Magistor_Current_Client: this.file.clientName,
      Magistor_Current_File: this.file.logisticFileType.slice(0, 3)
      // fileId: this.file.idFile,
      // account_id: user.id,
      // columns: this.displayedColumns,
      // rows: this.copyfileMagistor,

      // }
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

}
