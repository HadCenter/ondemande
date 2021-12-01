import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';



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
  @ViewChild('check') check: ElementRef;

  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  displayedColumns: any;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];
  testFile: any;
  options: any = [];
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

  constructor(private _snackBar: MatSnackBar) {
    super();

  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("changes happend");
    console.log("changes happend   ", changes.data);
    //throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    console.log(this.data);
    console.log(this.typeFile);
    console.log(this.sheet1);
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
    this.displayedColumns = (Object.keys(this.data[0]));
    if (!this.oneBloc) {
      this.displayedColumns.unshift(this.displayedColumns.pop());
    }
    for (var i = 0; i < this.data.length; i++) {
      this.data[i]['REMARQUE'] = this.data[i]['REMARQUE'].split(';').join('\n');
    }

    this.LAST_EDITABLE_ROW = this.data.length - 1;
    this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
    this.testFile = this.data;
    // initialize all selectedCellsState to false
    this.data.forEach(element => {
      this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
    });
    console.log(this.displayedColumns);
    this.displayedColumns.forEach(item => {
      this.getOption(item);
    })
  }

  test(){
    console.log(this.sheet1);
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
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
  /**
    * @param rowId
    * @param colId
    * @param cellsType
    */
  onMouseDown(rowId: number, colId: number, cellsType: string) {
    if (this.clickCorrection == false) {
      this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.tableMouseDown2 = undefined;
      this.tableMouseUp2 = undefined;

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
    this.tableMouseDown2 = undefined;
    this.tableMouseUp2 = undefined;

    if (this.clickCorrection == false) {
      console.log("MOUSE 1 UP  ",this.tableMouseUp);
      this.tableMouseUp = { rowId: rowId, colId: colId, cellsType: cellsType };
      if (this.tableMouseDown) {
        this.newCellValue = '';
        if (document.querySelector('td.selected') !== null) {
          document.querySelector('td.selected').classList.remove('selected');
          console.log("found selected and removed");
          this.tableMouseDown2 = undefined;
          this.tableMouseUp2 = undefined;

        }
        this.updateSelectedCellsState(this.tableMouseDown.colId, this.tableMouseUp.colId, this.tableMouseDown.rowId, this.tableMouseUp.rowId);
        console.log("MOUSE 1 UP 2ND ",this.tableMouseUp);

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
      this.tableMouseDown = undefined;
      this.tableMouseUp = undefined;
  
      this.tableMouseDown2 = { rowId: rowId, colId: colId, cellsType: cellsType };
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
  onMouseUp2(rowId: number, colId: number, cellsType: string) {
    this.tableMouseDown = undefined;
    this.tableMouseUp = undefined;
    if (this.clickCorrection == false) {
      this.tableMouseUp2 = { rowId: rowId, colId: colId, cellsType: cellsType };
      if (this.tableMouseDown2) {
        if (document.querySelector('td.selected') !== null) {
          document.querySelector('td.selected').classList.remove('selected');
          console.log("MOUSE 2 UP  ","found selected and removed");

        }
        this.newCellValue2 = '';
        this.updateSelectedCellsState(this.tableMouseDown2.colId, this.tableMouseUp2.colId, this.tableMouseDown2.rowId, this.tableMouseUp2.rowId);
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

    if (this.sheet1 && this.tableMouseDown && this.tableMouseUp) {
      this.openSnackBar('changement detecté dans la feuille 1', 'Fermé');
      if (this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {
        //convert every rows to object
        const dataCopy = this.copyData.slice();// copy and mutate
        console.log(dataCopy);
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
          console.log(endCol, '  --Edit cells from the same column', startCol);
          for (let i = startRow; i <= endRow; i++) {
            //change color after modify value
            this.copyData.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.originData.columns[startCol]]) {    // TO IMPROVE
                  var column = this.originData.columns[startCol];
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
          console.log('--Edit cells starting and ending not on the same column');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.originData.columns[j]] = text;
            }
          }
        }
        console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyData = dataCopy;
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé');
      }
    } else if (!this.sheet1 && this.tableMouseDown2 && this.tableMouseUp2) {
      this.openSnackBar('changement detecté dans la feuille 2', 'Fermé');

      if (this.tableMouseDown2.cellsType === this.tableMouseUp2.cellsType) {
        //convert every rows to object
        const dataCopy = this.copyData.slice();// copy and mutate
        console.log(dataCopy);
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
          console.log(endCol, '  --Edit cells from the same column 22', startCol);
          for (let i = startRow; i <= endRow; i++) {
            //change color after modify value
            this.copyData.forEach((element, index) => {
              if (index == i) {
                if (element[element.startCol] !== dataCopy[i][this.originData.columns[startCol]]) {    // TO IMPROVE
                  var column = this.originData.columns[startCol];
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
          console.log('--Edit cells starting and ending not on the same column 22');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.originData.columns[j]] = text;
            }
          }
        }
        console.log('--update: 22' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyData = dataCopy;
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé');
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
    let specialKeys: string[] = ['Enter', 'PrintScreen', 'Escape', 'cControl', 'NumLock', 'PageUp', 'PageDown', 'End',
      'Home', 'Delete', 'Insert', 'ContextMenu', 'Control', 'ControlAltGraph', 'Alt', 'Meta', 'Shift', 'CapsLock',
      'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Pause', 'ScrollLock', 'Dead', '',
      'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

    // If no cell is selected then ignore keyUp event
    if (this.sheet1) {
      console.log("ONKEY UP SHEET 1  ",this.sheet1 + " :: " +event.key);
      this.tableMouseDown2 = undefined;
      this.tableMouseUp2 = undefined;
      console.log(JSON.stringify(this.tableMouseDown) + " poop " +JSON.stringify(this.tableMouseUp));

      if (this.tableMouseDown != undefined && this.tableMouseUp != undefined) {

        if (event.key === 'Backspace') { // 'delete' key is pressed
          const end: number = this.newCellValue.length - 1;
          this.newCellValue = this.newCellValue.slice(0, end);

        } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
          this.newCellValue += event.key;
        }
        //this.updateSelectedCellsValues(this.newCellValue);
      }
    } else if (!this.sheet1) {
      this.tableMouseDown = undefined;
      this.tableMouseUp = undefined;

      console.log("ONKEY UP SHEET 2  "+this.sheet1 + " :: " +event.key);
      console.log(JSON.stringify(this.tableMouseDown2) + " poop " +JSON.stringify(this.tableMouseUp2));
      if (this.tableMouseDown2 != undefined && this.tableMouseUp2 != undefined) {
        if (event.key === 'Backspace') { // 'delete' key is pressed
          const end: number = this.newCellValue2.length - 1;
          this.newCellValue2 = this.newCellValue2.slice(0, end);
        } else if (this.indexOfInArray(event.key, specialKeys) === -1) {
          this.newCellValue2 += event.key;

        }
        this.updateSelectedCellsValues(this.newCellValue2);
      }
    }
  }

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }


}
