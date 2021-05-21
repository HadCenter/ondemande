import { Component, OnInit, HostListener, ɵConsole } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}

@Component({
  selector: 'app-details-file-edi',
  templateUrl: './details-file-edi.component.html',
  styleUrls: ['./details-file-edi.component.scss']
})
export class DetailsFileEdiComponent extends UpgradableComponent implements OnInit {
  public filterValue: any;
  file: any;
  fileWrong: any = [];
  fileValid: any;
  column: string;
  public snackAction = 'Ok';
  fileTocheck: any;
  _fileWrong: any;
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 3;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  newCellValue: string = '';
  showValid = true;
  copyFileWrong: any;
  fileWrongUpdated: any = [];
  showWrong: boolean = true; testFile: any;
  options: any = [];
  files: any;
  selection: any = [];
  displayedColumns = [];
  filterValues: any = [];
  clickCorrection: boolean = false;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];
  correctedFilerows: any;
  rowsToDelete: any = [];
  rowsToDeleteValid: any = [];
  alreadyClicked: boolean = false;
  displayedColumnsValid: any;

  constructor(private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog,
    private fileService: DetailsFileEdiService) {
    super();
  }

  ngOnInit(): void {
    this.getFile(this.route.snapshot.params.id);

  }

  // /******Open dialog Delete Row */
  // openDialog(i) {
  //   const dialogRef = this.dialog.open(DialogDeleteRowFile);
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log("result", result);

  //     if (result == true) {
  //       this.copyFileWrong.splice(i, 1);
  //       console.error(this.copyFileWrong);
  //       // this.actualiser();
  //     }
  //     console.error(this.copyFileWrong);

  //   });
  // }

  deleteRows(optionFile) {
    this.alreadyClicked = true;
    // delete row from valid file
    if (optionFile == "valid") {
      for (var i = this.fileValid.rows.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.rowsToDeleteValid.length; j++) {
          if (this.fileValid.rows[i] && (this.fileValid.rows[i][this.fileValid.rows[i].length - 1] === this.rowsToDeleteValid[j])) {
            this.fileValid.rows.splice(i, 1);
          }
        }
      }

      var user = JSON.parse(localStorage.getItem('currentUser'));
      //   this.rearrangeAttributesDelete();  //Remove unecessey columns
      this.hideUiSelectionOnCorrection();  //hide ui selection on correction

      let columns = this.fileValid.columns.slice(1);
      columns.splice(columns.length - 1, 1);

      this.rearrangeAttributesValidFile(); //Remove unecessey columns from valid file
      this.fileTocheck = {
        fileId: this.file.idFile,
        account_id: user.id,
        columns: columns,
        fileType: 'correct',
        rows: this.fileValid.rows,

      }

      this.fileService.updateFile(this.fileTocheck).subscribe(res => {
        if (res.message == "done") {
          // this.rowsToDelete = [];
          this.rowsToDeleteValid = [];
          this.alreadyClicked = false;
        }
      })


    }
    else {
      // delete row from wrong file
      for (var i = this.fileWrong.rows.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.rowsToDelete.length; j++) {
          if (this.fileWrong.rows[i] && (this.fileWrong.rows[i][this.fileWrong.rows[i].length - 1] === this.rowsToDelete[j])) {
            this.fileWrong.rows.splice(i, 1);
            this.files = this.files.filter((el) => !this.rowsToDelete.includes(el.rowId));
            this.testFile = this.testFile.filter((el) => !this.rowsToDelete.includes(el.rowId));
            this.copyFileWrong = this.copyFileWrong.filter((el) => !this.rowsToDelete.includes(el.rowId));
          }
        }
      }

      var user = JSON.parse(localStorage.getItem('currentUser'));
      this.rearrangeAttributesDelete();  //Remove unecessey columns
      this.hideUiSelectionOnCorrection();  //hide ui selection on correction

      this.removeUnecesseryColumnsDelete(); // from rows filewrong
      this.fileTocheck = {
        fileId: this.file.idFile,
        account_id: user.id,
        columns: this._fileWrong.columns,
        rows: this.correctedFilerows,
        fileType: 'error',

      }
      this.fileService.updateFile(this.fileTocheck).subscribe(res => {
        if (res.message == "done") {
          this.rowsToDelete = [];
          // this.rowsToDeleteValid = [];
          this.alreadyClicked = false;
        }
      })

    }

  }
  selectDeleteRowValidFile(rowId) {
    //uncheck delete rowId from rowstoDelete
    if (this.rowsToDeleteValid.includes(rowId)) {
      this.rowsToDeleteValid.splice(this.rowsToDeleteValid.indexOf(rowId), 1);
    }
    //check add to rowTodelete
    else {
      this.rowsToDeleteValid.push(rowId);

    }
  }

  selectDeleteRow(rowId) {
    //uncheck delete rowId from rowstoDelete
    if (this.rowsToDelete.includes(rowId)) {
      this.rowsToDelete.splice(this.rowsToDelete.indexOf(rowId), 1);
    }
    //check add to rowTodelete
    else {
      this.rowsToDelete.push(rowId);

    }
    //  this.openDialog(i);

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
        const dataCopy = this.copyFileWrong.slice();// copy and mutate
        let startCol: number;
        let endCol: number;
        let startRow: number;
        let endRow: number;

        if (this.tableMouseDown.colId <= this.tableMouseUp.colId) {
          startCol = this.tableMouseDown.colId - 1;
          endCol = this.tableMouseUp.colId - 1;
        } else {
          endCol = this.tableMouseDown.colId - 1;
          startCol = this.tableMouseUp.colId - 1;
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
            this.copyFileWrong.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.fileWrong.columns[startCol]]) {    // TO IMPROVE
                  console.warn('THERE IS A CHANGE');
                  var column = this.fileWrong.columns[startCol];
                  var container = document.querySelectorAll<HTMLElement>("#" + column);
                  container[index].style.setProperty("color", "green", "important");
                }
              }
            });
            dataCopy[i][this.fileWrong.columns[startCol]] = text;
          }
        } else {
          //--Edit cells starting and ending not on the same column
          console.log('--Edit cells starting and ending not on the same column');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.fileWrong.columns[j]] = text;
            }
          }
        }
        console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyFileWrong = dataCopy;
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'OK');
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

  customTrackBy(index: number, obj: any) {
    return index;
  }

  getWrongFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.wrongCommands,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      console.warn(res)
      this.fileWrong = res;
      //create a copy array of object from the res and an array of displayed column
      this.copyFileWrong = JSON.parse(JSON.stringify(this.fileWrong));

      this.copyFileWrong.rows.splice(0, 0, this.copyFileWrong.columns);
      this.copyFileWrong = this.convertToArrayOfObjects(this.copyFileWrong.rows);
      this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1); //sort by remaque id
      this.testFile = this.copyFileWrong;   //copy to use on selection
      this.files = this.copyFileWrong;    // copy to filter *

      this.displayedColumns = (Object.keys(this.copyFileWrong[0])).slice((Object.keys(this.copyFileWrong[0]).indexOf("Remarque")), (Object.keys(this.copyFileWrong[0]).indexOf("Remarque_id")));  //not display unecessery column

      this.displayedColumns.unshift("Delete");  //add column Delete
      //
      this.showWrong = false;
      this.LAST_EDITABLE_ROW = this.copyFileWrong.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;

      // initialize all selectedCellsState to false
      this.copyFileWrong.forEach(element => {
        //get checkbox selected by default
        if (element.selected == 1) {
          this.selection.push(element.rowId);
        }
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
      });
      // get select options
      this.displayedColumns.forEach(item => {
        this.getOption(item);
      })
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
      return options.indexOf(value) == index && value != "";
    });

    this.displayedColumns.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj)
      }
    })
  }

  getIntersection(filter) {
    return this.copyFileWrong.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }


  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.copyFileWrong = this.filterChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.copyFileWrong = this.getIntersection(filter)
      }
      else {
        this.copyFileWrong = this.files;
        this.filterValues.forEach(element => {
          this.copyFileWrong = this.copyFileWrong.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.copyFileWrong = this.copyFileWrong.filter((object, index) => index === this.copyFileWrong.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues.length == 0) {
        this.copyFileWrong = this.testFile;
        this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValues.length == 1) {
        this.copyFileWrong = this.filterChange(this.filterValues[0])
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.copyFileWrong = this.testFile;
        this.filterValues.forEach(element => {
          this.copyFileWrong = this.copyFileWrong.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
      }
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
   * Get lignes when filter change
   * @param filter
   */
  filterChange(filter) {
    this.initSelectedCells();     // init selected cells
    this.files = this.files.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.files.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  /**
  * Reset filter
  */
  resetFiltre() {
    this.initSelectedCells();    // init selected cells
    // reset the selected filtre
    this.options.forEach(element => {
      if (element.hasOwnProperty("modelValue")) {
        element.modelValue = ""
      }
    });
    this.filterValues = [];
    this.copyFileWrong = this.testFile;
    this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
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

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileValid = res;
      this.showValid = false;
      this.fileValid.columns.unshift("Delete");  //add column Delete
      // this.displayedColumnsValid=this.fileValid.columns.splice(0,this.fileValid.columns.length-2)
      console.warn('File valid', this.fileValid)
    })

  }

  getFile(id: string) {
    this.fileService.get(id)
      .subscribe(
        data => {
          this.file = data;
          if (this.file.validatedOrders != '_') {
            this.getValidFile();
          }
          else {
            this.showValid = false;
          }
          if (this.file.wrongCommands != '_') {
            this.getWrongFile();
          }
          else {
            this.showWrong = false;
          }
        },
        error => {
          console.log(error);
        });
  }

  /**
    * Rearrange the wrong file ;
    * take the value of the selected checkboxes
    * moving selected column
    * removing unnecessary columns
    */
  rearrangeAttributes() {
    //Fix selected attribute
    this.copyFileWrong.forEach(element => {
      if (element.selected == 1) { this.selection.push(element.rowId) } //push element already checked on selection
      if (this.selection.includes(element.rowId)) { //if rowId exist on selection
        element.selected = 1; // change attribute to 1
      } else {
        element.selected = 0;  // change attribute to 0
      }
    });
    //remove column remarque & delete column & put selected on last column
    let columns = this.displayedColumns.slice(2);
    columns.push(columns.shift());
    //remove unessecerry column from rows (remarque,rowId,remarqueId)& put selected on last column
    let rows = this.copyFileWrong.map(Object.values);
    rows.forEach(element => {
      element.shift();   // remove remarque from rows
      element.splice(element.length - 2, 2); // remove rowId & remarqueId column from rows
      element.push(element.shift()); // put selected on last column of rows

    });
    //
    this.fileWrongUpdated = {
      columns: columns,
      rows: rows
    }
    this._fileWrong = JSON.parse(JSON.stringify(this.fileWrongUpdated));
  }

  rearrangeAttributesDelete() {
    //Fix selected attribute
    this.copyFileWrong.forEach(element => {
      if (element.selected == 1) { this.selection.push(element.rowId) } //push element already checked on selection
      if (this.selection.includes(element.rowId)) { //if rowId exist on selection
        element.selected = 1; // change attribute to 1
      } else {
        element.selected = 0;  // change attribute to 0
      }
    });
    //remove column remarque & delete column & put selected on last column
    let columns = this.fileWrong.columns.slice(1);
    columns.splice(columns.length - 1, 1); // remove rowId from rows
    columns.push(columns.shift());
    //remove unessecerry column from rows (remarque,rowId,remarqueId)& put selected on last column
    let rows = this.copyFileWrong.map(Object.values);
    rows.forEach(element => {

      element.shift();   // remove remarque from rows
      element.splice(element.length - 1, 1); // remove rowId column from rows
      element.push(element.shift()); // put selected on last column of rows

    });
    //
    this.fileWrongUpdated = {
      columns: columns,
      rows: rows
    }
    this._fileWrong = JSON.parse(JSON.stringify(this.fileWrongUpdated));
  }

  /**
   * Rearrange the valid file ;
   * removing last column
   */
  rearrangeAttributesValidFile() {
    this.fileValid.rows.forEach(element => {
      element.pop();
      // element.splice(element.length - 1, 1); // remove rowId & remarqueId column from rows
      // element.push(element.shift());
    });
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

  /**
  * Correct the wrong file
  */
  correctionFile() {
    this.clickCorrection = true;
    var user = JSON.parse(localStorage.getItem('currentUser'));
    this.rearrangeAttributes();  //Remove unecessey columns
    this.hideUiSelectionOnCorrection();  //hide ui selection on correction
    if (this.fileWrong && this.fileValid) {
      this.rearrangeAttributesValidFile(); //Remove unecessey columns from valid file
      this.removeUnecesseryColumns(); // from rows filewrong
      this.fileTocheck = {
        fileId: this.file.idFile,
        account_id: user.id,
        columns: this._fileWrong.columns,
        rows: this.fileValid.rows.concat(this.correctedFilerows),

      }
    }
    else {
      this.removeUnecesseryColumns();  //from rows filewrong
      this.fileTocheck = {
        fileId: this.file.idFile,
        account_id: user.id,
        columns: this._fileWrong.columns,
        rows: this.correctedFilerows,
      }
    }
    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    console.warn("**file to check**", this.fileTocheck)
    this.fileService.corretFile(this.fileTocheck).subscribe(res => {
      console.log('resultat correction', res);
      if (res.message == "success") {
        this.router.navigate(['/list-file-edi']);
      }
    })
  }

  removeUnecesseryColumns() {
    this.correctedFilerows = this.files.map(Object.values);
    this.correctedFilerows.forEach(element => {
      element.shift();   // remove remarque from rows
      element.splice(element.length - 2, 2); // remove rowId & remarqueId column from rows
      element.push(element.shift()); // put selected on last column of rows

    });
  }

  removeUnecesseryColumnsDelete() {
    this.correctedFilerows = this.files.map(Object.values);
    this.correctedFilerows.forEach(element => {
      element.shift();   // remove remarque from rows
      //   element.splice(element.length - 2, 1); // remove rowId 
      element.push(element.shift()); // put selected on last column of rows
      element.splice(element.length - 2, 1); // remove rowId 
    });
  }

  /**
  * Send file edi to Urbantz
  */
  sendFileToUrbantz() {
    let data = {
      clientCode: this.file.contact.codeClient,
      fileName: this.file.validatedOrders,
    }
    this.fileService.sendFileToUrbantz(data).subscribe(res => {
      console.log("res urbantz", res);
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  /**
   * Event onChange of checkbox value
   * @param row
   */
  public onCheckboxStateChange(row) {
    //check
    if (row.selected !== 1) {
      this.selection.push(row.rowId);
      row.selected = 1;
    }
    //uncheck
    else {
      row.selected = 0;
      this.selection = this.selection.filter(function (item) {
        return item !== row.rowId
      })
    }
  }
  /**** Filter items */
  setFilteredItems() {
    this.copyFileWrong = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.copyFileWrong = this.copyFileWrong;
    }
  }

  filterItems(filterValue: string) {
    return this.files.filter((item) => {
      return JSON.stringify(Object.values(item)).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

}

// @Component({
//   templateUrl: 'dialog/delete-row.component.html',
//   styleUrls: ['dialog/delete-row.component.scss']
// })
// export class DialogDeleteRowFile {

//   showloader = false;
//   clicked = false;
//   public snackAction = 'voir plus +';
//   snackActionExpediteur = "ok";
//   minWidth: number = 250;
//   width: number = this.minWidth;

//   constructor(
//     public dialogRef: MatDialogRef<DialogDeleteRowFile>,
//     private _snackBar: MatSnackBar
//   ) {
//   }
//   ngOnInit(): void {

//   }
//   onNoclick() {
//     this.dialogRef.close();
//   }
// }
