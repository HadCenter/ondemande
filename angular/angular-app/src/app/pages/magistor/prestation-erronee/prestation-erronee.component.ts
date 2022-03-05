import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { emit } from 'process';
import { UpgradableComponent } from 'theme/components/upgradable';
import { PrestationErroneeService } from './prestation-erronee.service';



export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}


@Component({
  selector: 'app-prestation-erronee',
  templateUrl: './prestation-erronee.component.html',
  styleUrls: ['./prestation-erronee.component.scss']
})
export class PrestationErroneeComponent extends UpgradableComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() sheet1: boolean
  @Input() typeFile: string
  @Input() oneBloc: boolean;
  @Input() originData: any;
  @Output() changedDataEvent = new EventEmitter<any>();
  @ViewChild('check') check: ElementRef;
  filterValueError: any;
  filterValueError2: any;
  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  displayedColumns: any;
  shiftedDisplayedColumns: any;
  shiftedDisplayedColumns2: any;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];
  testFileError: any;
  fileError: any = [];
  optionsError: any = [];
  testFileError2: any;
  fileError2: any = [];
  options2Error: any = [];
  copyData: any;
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  tableMouseDown2: MouseEvent;
  tableMouseUp2: MouseEvent;
  newCellValue: string = '';
  newCellValue2: string = '';
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 0;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  clickCorrection: boolean = false;
  filterValuesError: any = [];
  filterValuesError2: any = [];
  private displayedColumns2: string[];
  private data2: any;

  public currentPage = 1;
  private countPerPage = 5;
  public numPage = 1;
  public advancedTable = [];
  copyFilesErrorPerPagination = [];

  public currentPage2 = 1;
  private countPerPage2 = 5;
  public numPage2 = 1;
  public advancedTable2 = [];
  copyFilesErrorPerPagination2 = [];

  constructor(private eRef: ElementRef,
    private prestationService: PrestationErroneeService,
    private _snackBar: MatSnackBar) {
    super();

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    this.originData = changes.originData.currentValue;

    //this.prestationService.saveData(this.data)

  }

  ngOnInit(): void {
    this.copyData = this.data;
    if (this.typeFile == "ART01") {
      this.typeFileART = true;
    }
    else if (this.typeFile == "REC01") {
      this.typeFileREC = true;
    }
    else if (this.typeFile == "CDC01") {
      this.typeFileCDC = true;
    }


    if (this.sheet1) {

      this.displayedColumns = (Object.keys(this.data[0]));
      this.shiftedDisplayedColumns = (Object.keys(this.data[0]));
      if (!this.oneBloc) {
        this.displayedColumns.unshift(this.displayedColumns.pop());
        this.shiftedDisplayedColumns.pop();
        for (var i = 0; i < this.data.length; i++) {
          //si ça contient plusieurs remarques alors affiche chaque remarque dans une ligne
          if (this.data[i]['REMARQUE'].includes(";")) {
            this.data[i]['REMARQUE'] = this.data[i]['REMARQUE'].split(';').join('\n');
          }
        }
      }
      this.LAST_EDITABLE_ROW = this.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
      //this.data=this.prestationService.sheet1;
      this.copyFilesErrorPerPagination = this.data;
      this.testFileError = this.data;  // copy to selection
      this.fileError = this.data // copy to filter

      this.numPage = Math.ceil(this.data.length / this.countPerPage);
      this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */
      // initialize all selectedCellsState to false
      this.data.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
      });
      this.displayedColumns.forEach(item => {
        this.getOption(item);
      })
    } else {
      this.data2 = this.data;
      this.displayedColumns2 = (Object.keys(this.data2[0]));
      this.shiftedDisplayedColumns2 = (Object.keys(this.data2[0]));

      if (!this.oneBloc) {
        this.displayedColumns2.unshift(this.displayedColumns2.pop());
        this.shiftedDisplayedColumns2.pop();

        for (var i = 0; i < this.data2.length; i++) {
          //si ça contient plusieurs remarques alors affiche chaque remarque dans une ligne
          if (this.data2[i]['REMARQUE'].includes(";")) {
            this.data2[i]['REMARQUE'] = this.data2[i]['REMARQUE'].split(';').join('\n');
          }
        }

      }
      this.LAST_EDITABLE_ROW = this.data2.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns2.length - 1;
      this.copyFilesErrorPerPagination2 = this.data2;
      this.testFileError2 = this.data2;  // copy to selection
      this.fileError2 = this.data2 // copy to filter

      this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
      this.advancedTable2 = this.getAdvancedTablePage2(1, this.countPerPage2); /****to display */

      // initialize all selectedCellsState to false
      this.data2.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns2.length - 1 }, () => false))
      });
      this.displayedColumns2.forEach(item => {
        this.getOption2(item);
      })
    }

  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.data.slice((page - 1) * countPerPage, page * countPerPage);
  }
  public getAdvancedTablePage2(page, countPerPage2) {
    return this.data2.slice((page - 1) * countPerPage2, page * countPerPage2);
  }

  public changePage2(page, force = false) {
    if (page !== this.currentPage2 || force) {
      this.currentPage2 = page;
      this.advancedTable2 = this.getAdvancedTablePage2(page, this.countPerPage2);
    }
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  /**
   * Reset filter
   */
  resetFiltre2() {
    const rows = document.getElementsByClassName('titre-column-magistor2') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < rows.length; i++) {
      rows[i].style.color = 'white';
    }
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;
      }
    }
    // reset the selected filtre
    this.options2Error.forEach(element => {
      if (element.hasOwnProperty("modelValue")) {
        element.modelValue = ""
      }
    });
    this.filterValuesError2 = [];
    this.data2 = this.testFileError2;
    this.data2 = this.data2.sort((a, b) => (a.OP_CODE > b.OP_CODE) ? 1 : -1);
    this.currentPage2 = this.data2.length > 0 ? 1 : 0;
    this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
    this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
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
    this.optionsError.forEach(element => {
      if (element.hasOwnProperty("modelValue")) {
        element.modelValue = ""
      }
    });
    this.filterValuesError = [];
    this.data = this.testFileError;
    this.data = this.data.sort((a, b) => (a.OP_CODE > b.OP_CODE) ? 1 : -1);
    this.currentPage = this.data.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.data.length / this.countPerPage);
    this.advancedTable = this.data.slice(0, this.countPerPage);
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  /**
    * Get optionsError inside selects
    * @param filter
    */
  getOption(filter) {
    let optionsError = [];
    optionsError = this.testFileError.map((item) => item[filter]);
    optionsError = optionsError.filter(function (value, index, optionsError) {

      return optionsError.indexOf(value) == index && value !== "";
    });
    this.displayedColumns.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsError
        };
        this.optionsError.push(obj);
      }
    })

  }

  getOption2(filter) {
    let optionsError = [];
    optionsError = this.testFileError2.map((item) => item[filter]);
    optionsError = optionsError.filter(function (value, index, optionsError) {

      return optionsError.indexOf(value) == index && value !== "";
    });
    this.displayedColumns2.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsError
        };
        this.options2Error.push(obj);
      }
    })
  }

  /* change color of the selected column header on file livraison*/

  changeSelectedOptionColor(filter) {
    if (filter.columnProp && filter.modelValue != "") {
      document.getElementById(filter.columnProp + "ERROR").style.color = "#00bcd4";
    }
    else {
      document.getElementById(filter.columnProp + "ERROR").style.color = "white";
    }
  }

  changeSelectedOptionColor2(filter) {
    if (filter.columnProp && filter.modelValue != "") {
      document.getElementById(filter.columnProp + "ERROR2").style.color = "#00bcd4";
    }
    else {
      document.getElementById(filter.columnProp + "ERROR2").style.color = "white";
    }
  }

  filterChange(filter) {
    this.initSelectedCells();     // init selected cells
    this.fileError = this.testFileError;
    return this.fileError.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }
  filterChange2(filter) {
    this.initSelectedCells();     // init selected cells
    this.fileError2 = this.testFileError2;
    return this.fileError2.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }
  getIntersection(filter) {
    return this.data.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }
  getIntersection2(filter) {
    return this.data2.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }


  /**** Filter items on error file */
  setFilteredItemsError() {
    this.copyFilesErrorPerPagination = this.filterItemsError(this.filterValueError);
    if (this.filterValueError === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyFilesErrorPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyFilesErrorPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyFilesErrorPerPagination.slice(0, this.countPerPage);
  }


  filterItemsError(filterValueError: string) {
    return this.testFileError.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValueError.toLowerCase());
    });
  }


  /**** Filter items on error file */
  setFilteredItemsError2() {

    this.copyFilesErrorPerPagination2 = this.filterItemsError2(this.filterValueError2);
    if (this.filterValueError2 === '') {
      this.advancedTable2 = this.advancedTable2;
    }
    this.currentPage2 = this.copyFilesErrorPerPagination2.length > 0 ? 1 : 0;
    this.numPage2 = Math.ceil(this.copyFilesErrorPerPagination2.length / this.countPerPage2);
    this.advancedTable2 = this.copyFilesErrorPerPagination2.slice(0, this.countPerPage2);


  }


  filterItemsError2(filterValueError2: string) {
    return this.testFileError2.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValueError2.toLowerCase());
    });
  }




  setFilteredItemsOptions(filter) {
    // check if filter is already selected

    const filterExists = this.filterValuesError.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);
    if (filterExists == false) { this.filterValuesError.push(filter) }
    // if only one select is selected
    if (this.filterValuesError.length == 1) {

      this.fileError = this.filterChange(filter);
      this.data = this.fileError;
      this.currentPage = this.data.length > 0 ? 1 : 0;
      this.numPage = Math.ceil(this.data.length / this.countPerPage);
      this.advancedTable = this.data.slice(0, this.countPerPage);


      //   this.data = this.fileError;
    }
    else {

      // if already another select is active merge the results
      if (filterExists == false) {

        this.data = this.getIntersection(filter);
        this.currentPage = this.data.length > 0 ? 1 : 0;
        this.numPage = Math.ceil(this.data.length / this.countPerPage);
        this.advancedTable = this.data.slice(0, this.countPerPage);
      }
      else {
        this.data = this.fileError;
        this.filterValuesError.forEach(element => {
          this.data = this.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.data = this.data.filter((object, index) => index === this.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.currentPage = this.data.length > 0 ? 1 : 0;
        this.numPage = Math.ceil(this.data.length / this.countPerPage);
        this.advancedTable = this.data.slice(0, this.countPerPage);
      }

    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValuesError = this.filterValuesError.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValuesError.length == 0) {
        this.data = this.testFileError;
        this.currentPage = this.data.length > 0 ? 1 : 0;
        this.numPage = Math.ceil(this.data.length / this.countPerPage);
        this.advancedTable = this.data.slice(0, this.countPerPage);
        //this.data = this.data.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValuesError.length == 1) {
        this.data = this.filterChange(this.filterValuesError[0]);
        this.currentPage = this.data.length > 0 ? 1 : 0;
        this.numPage = Math.ceil(this.data.length / this.countPerPage);
        this.advancedTable = this.data.slice(0, this.countPerPage);
      }
      else {
        this.filterValuesError = this.filterValuesError.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.data = this.testFileError;
        this.filterValuesError.forEach(element => {
          this.data = this.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.currentPage = this.data.length > 0 ? 1 : 0;
        this.numPage = Math.ceil(this.data.length / this.countPerPage);
        this.advancedTable = this.data.slice(0, this.countPerPage);
      }

    }

  }
  setFilteredItemsOptions2(filter) {
    // check if filter is already selected

    const filterExists = this.filterValuesError2.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor2(filter);
    if (filterExists == false) { this.filterValuesError2.push(filter) }
    // if only one select is selected
    if (this.filterValuesError2.length == 1) {
      this.fileError2 = this.filterChange2(filter);
      this.data2 = this.fileError2;
      this.currentPage2 = this.data2.length > 0 ? 1 : 0;
      this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
      this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
    }
    else {

      // if already another select is active merge the results
      if (filterExists == false) {

        this.data2 = this.getIntersection2(filter);
        this.currentPage2 = this.data2.length > 0 ? 1 : 0;
        this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
        this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
      }
      else {
        this.data2 = this.fileError2;
        this.filterValuesError2.forEach(element => {
          this.data2 = this.data2.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.data2 = this.data2.filter((object, index) => index === this.data2.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.currentPage2 = this.data2.length > 0 ? 1 : 0;
        this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
        this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
      }

    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValuesError2 = this.filterValuesError2.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValuesError2.length == 0) {
        this.data2 = this.testFileError2;
        this.currentPage2 = this.data2.length > 0 ? 1 : 0;
        this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
        this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
        //this.data2 = this.data2.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValuesError2.length == 1) {
        this.data2 = this.filterChange2(this.filterValuesError2[0]);
        this.currentPage2 = this.data2.length > 0 ? 1 : 0;
        this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
        this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
      }
      else {
        this.filterValuesError2 = this.filterValuesError2.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.data2 = this.testFileError2;
        this.filterValuesError2.forEach(element => {
          this.data2 = this.data2.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.currentPage2 = this.data2.length > 0 ? 1 : 0;
        this.numPage2 = Math.ceil(this.data2.length / this.countPerPage2);
        this.advancedTable2 = this.data2.slice(0, this.countPerPage2);
      }

    }

  }

  /**
    * @param rowId
    * @param colId
    * @param cellsType
    */
  onMouseDown(rowId: number, colId: number, cellsType: string) {
    if (this.clickCorrection == false && cellsType != 'REMARQUE') {
      //this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseDown({ rowId: rowId, colId: colId, cellsType: cellsType });
      this.prestationService.settableMouseUp2(undefined);
      this.prestationService.settableMouseDown2(undefined);
      //console.log("MOUSE 1 DOWN  ", this.prestationService.gettableMouseDown());
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
    // this.tableMouseDown2 = undefined;
    // this.tableMouseUp2 = undefined;
    this.prestationService.settableMouseUp2(undefined);
    this.prestationService.settableMouseDown2(undefined);
    //this.prestationService.setLastTableClicked(true);
    if (this.clickCorrection == false && cellsType != 'REMARQUE') {
      //console.log("MOUSE 1 UP  ", this.prestationService.gettableMouseUp());
      //this.tableMouseUp = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseUp({ rowId: rowId, colId: colId, cellsType: cellsType });

      if (this.prestationService.gettableMouseDown()) {
        this.newCellValue = '';
        if (document.querySelector('td.selected') !== null) {
          document.querySelector('td.selected').classList.remove('selected');
          //console.log("found selected and removed");
          // this.tableMouseDown2 = undefined;
          // this.tableMouseUp2 = undefined;
          this.prestationService.settableMouseUp2(undefined);
          this.prestationService.settableMouseDown2(undefined);


        }
        this.prestationService.setSheet1(true);
        // this.updateSelectedCellsState(this.tableMouseDown.colId,
        //   this.tableMouseUp.colId,
        //   this.tableMouseDown.rowId,
        //   this.tableMouseUp.rowId);
        this.updateSelectedCellsState(this.prestationService.gettableMouseDown().colId,
          this.prestationService.gettableMouseUp().colId,
          this.prestationService.gettableMouseDown().rowId,
          this.prestationService.gettableMouseUp().rowId);
        //console.log("MOUSE 1 UP 2ND ", this.prestationService.gettableMouseUp());

      }
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
  onMouseDown2(rowId: number, colId: number, cellsType: string) {
    if (this.clickCorrection == false) {
      // this.tableMouseDown = undefined;
      // this.tableMouseUp = undefined;
      this.prestationService.settableMouseUp(undefined);
      this.prestationService.settableMouseDown(undefined);

      //this.tableMouseDown2 = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseDown2({ rowId: rowId, colId: colId, cellsType: cellsType });
    }
    else {  //disable click after click correction
      return false;
    }
    //console.log("MOUSE DOWN 2  ",this.tableMouseUp);

  }

  /**
   * @param rowId
   * @param colId
   * @param cellsType
   */
  onMouseUp2(rowId: number, colId: number, cellsType: string) {
    // this.tableMouseDown = undefined;
    // this.tableMouseUp = undefined;
    if (this.clickCorrection == false) {
      //this.tableMouseUp2 = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseUp2({ rowId: rowId, colId: colId, cellsType: cellsType });

      if (this.prestationService.gettableMouseDown2()) {
        if (document.querySelector('td.selected') !== null) {
          document.querySelector('td.selected').classList.remove('selected');
          //console.log("MOUSE 2 UP  ", "found selected and removed");
          this.prestationService.settableMouseUp(undefined);
          this.prestationService.settableMouseDown(undefined);

        }
        this.prestationService.setSheet1(false);
        this.newCellValue2 = '';
        //this.updateSelectedCellsState(this.tableMouseDown2.colId, this.tableMouseUp2.colId, this.tableMouseDown2.rowId, this.tableMouseUp2.rowId);
        this.updateSelectedCellsState(this.prestationService.gettableMouseDown2().colId,
          this.prestationService.gettableMouseUp2().colId,
          this.prestationService.gettableMouseDown2().rowId,
          this.prestationService.gettableMouseUp2().rowId);

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
      * Update table's dataSource
      * @param text
      */
  updateSelectedCellsValues(text: string) {

    if (text == null) { return; }
    this.tableMouseDown = this.prestationService.gettableMouseDown();
    this.tableMouseUp = this.prestationService.gettableMouseUp();
    if (this.tableMouseDown && this.tableMouseUp) {
      //this.openSnackBar('changement detecté dans la feuille 1', 'Fermé');
      if (this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {
        //convert every rows to object
        const dataCopy = this.copyData.slice();// copy and mutate
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
          //console.log(endCol, '  --Edit cells from the same column', startCol);
          for (let i = startRow; i <= endRow; i++) {
            //change color after modify value
            this.copyData.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.originData.columns[startCol]]) {    // TO IMPROVE
                  var column = this.originData.columns[startCol];
                  //console.log("column : ", column);
                  var container = document.querySelectorAll<HTMLElement>("#" + column + "magistor");
                  container[index].style.setProperty("color", "green", "important");
                }
              }
            });
            dataCopy[i][this.originData.columns[startCol]] = text;
            //console.log("startRow : ", startRow , " ,  endRow : ",endRow );
          }
        } else {
          //--Edit cells starting and ending not on the same column
          //console.log('--Edit cells starting and ending not on the same column');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.originData.columns[j]] = text;
            }
          }
        }
        //console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyData = dataCopy;
        this.changedDataEvent.emit(this.copyData);
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé');
      }
    }
    this.tableMouseDown = undefined;
    this.tableMouseUp = undefined;

  }


  /**
        * Update table's dataSource
        * @param text
        */
  updateSelectedCellsValues2(text: string) {

    if (text == null) { return; }
    this.tableMouseDown2 = this.prestationService.gettableMouseDown2();
    this.tableMouseUp2 = this.prestationService.gettableMouseUp2();

    if (this.tableMouseDown2 && this.tableMouseUp2) {
      //this.openSnackBar('changement detecté dans la feuille 2', 'Fermé');

      if (this.tableMouseDown2.cellsType === this.tableMouseUp2.cellsType) {
        //convert every rows to object
        const dataCopy = this.copyData.slice();// copy and mutate
        //console.log("after slice     : ", dataCopy);
        let startCol: number;
        let endCol: number;
        let startRow: number;
        let endRow: number;

        if (this.tableMouseDown2.colId <= this.tableMouseUp2.colId) {
          startCol = this.tableMouseDown2.colId;
          endCol = this.tableMouseUp2.colId;
        } else {
          endCol = this.tableMouseDown2.colId;
          startCol = this.tableMouseUp2.colId;
        }

        if (this.tableMouseDown2.rowId <= this.tableMouseUp2.rowId) {
          startRow = this.tableMouseDown2.rowId;
          endRow = this.tableMouseUp2.rowId;
        } else {
          endRow = this.tableMouseDown2.rowId;
          startRow = this.tableMouseUp2.rowId;
        }

        //--Edit cells from the same column
        if (startCol === endCol) {
          //console.log(endCol, '  --Edit cells from the same column 22', startCol);
          for (let i = startRow; i <= endRow; i++) {
            //change color after modify value
            this.copyData.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.originData.columns[startCol]]) {    // TO IMPROVE
                  var column = this.originData.columns[startCol];
                  //console.log("column 2: ", column);
                  var container = document.querySelectorAll<HTMLElement>("#" + column + "magistor2");
                  container[index].style.setProperty("color", "green", "important");
                }
              }
            });
            dataCopy[i][this.originData.columns[startCol]] = text;
            //console.log("startRow : ", startRow , " ,  endRow : ",endRow );
          }
        } else {
          //--Edit cells starting and ending not on the same column
          //console.log('--Edit cells starting and ending not on the same column 22');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.originData.columns[j]] = text;
            }
          }
        }
        //console.log('--update: 22' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyData = dataCopy;
        this.changedDataEvent.emit(this.copyData);

      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé');
      }
    }
    this.tableMouseDown2 = undefined;
    this.tableMouseUp2 = undefined;

  }



  // @HostListener('document:click', ['$event'])
  // clickout(event) {
  //   if (this.prestationService.isSheet1()){
  //   if(this.eRef.nativeElement.contains(event.target)) {
  //     console.log("clicked inside");

  //   this.prestationService.settableMouseDown2(undefined);
  //   this.prestationService.settableMouseUp2(undefined);


  //   } else {
  //     if (document.querySelector('td.selected') !== null) {
  //       document.querySelector('td.selected').classList.remove('selected');
  //       console.log("clicked outside");
  //   this.prestationService.settableMouseDown(undefined);
  //   this.prestationService.settableMouseUp(undefined);

  //     }
  //   }
  // }
  // }
  onMouseDownAll() {
    // console.log("mouse all happend");
    // if (document.querySelector('td.selected') !== null) {
    //   document.querySelector('td.selected').classList.remove('selected');
    // this.prestationService.settableMouseDown2(undefined);
    // this.prestationService.settableMouseDown(undefined);
    // this.prestationService.settableMouseUp2(undefined);
    // this.prestationService.settableMouseUp(undefined);

    // }

  }

  /**
 * After the user enters a new value, all selected cells must be updated
 * document:keyup
 * @param event
 */
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
      'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
      'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

    //If no cell is selected then ignore keyUp event
    if (this.prestationService.isSheet1() && this.sheet1) {
      //console.log("ONKEY UP SHEET 1  ", this.sheet1 + " :: " + event.key);
      // this.tableMouseDown2 = undefined;
      // this.tableMouseUp2 = undefined;
      this.prestationService.settableMouseDown2(undefined);
      this.prestationService.settableMouseUp2(undefined);

      //console.log(JSON.stringify(this.tableMouseDown) + " poop " + JSON.stringify(this.tableMouseUp));

      if (this.prestationService.gettableMouseDown() != undefined && this.prestationService.gettableMouseUp() != undefined) {

        if (event.key === 'Backspace') { // 'delete' key is pressed
          const end: number = this.newCellValue.length - 1;
          this.newCellValue = this.newCellValue.slice(0, end);

        } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
          this.newCellValue += event.key;
        }
        this.updateSelectedCellsValues(this.newCellValue);
      }
    }
    if (!this.prestationService.isSheet1() && !this.sheet1) {
      // this.tableMouseDown = undefined;
      // this.tableMouseUp = undefined;
      this.prestationService.settableMouseDown(undefined);
      this.prestationService.settableMouseUp(undefined);

      //console.log("ONKEY UP SHEET 2  " + this.sheet1 + " :: " + event.key);
      // console.log(JSON.stringify(this.tableMouseDown2) + " poop " + JSON.stringify(this.tableMouseUp2));
      if (this.prestationService.gettableMouseDown2() != undefined && this.prestationService.gettableMouseUp2() != undefined) {
        if (event.key === 'Backspace') { // 'delete' key is pressed
          const end: number = this.newCellValue2.length - 1;
          this.newCellValue2 = this.newCellValue2.slice(0, end);
        } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
          this.newCellValue2 += event.key;

        }
        this.updateSelectedCellsValues2(this.newCellValue2);
      }
    }
    //console.log(this.prestationService.isSheet1());
  }

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }


}
