import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  displayedColumns: any;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
  ];
  testFile: any;
  files:any =[];
  options: any = [];
  testFile2: any;
  files2:any =[];
  options2: any = [];
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
  filterValues: any = [];
  private displayedColumns2: string[];
  private data2: any;
  constructor(private eRef: ElementRef,
    private prestationService: PrestationErroneeService,
    private _snackBar: MatSnackBar) {
    super();

  }
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("changes happend");
    console.log("data changes happend   ", changes.data.currentValue);
    this.data = changes.data.currentValue;
    this.originData = changes.originData.currentValue;
    //throw new Error('Method not implemented.');
    this.prestationService.saveData( this.data)
    console.log("origindata changes happend   ", changes.originData.currentValue);

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

      this.displayedColumns = (Object.keys(this.data[0]));
      if (!this.oneBloc) {
        this.displayedColumns.unshift(this.displayedColumns.pop());
        for (var i = 0; i < this.data.length; i++) {
          //si ça contient plusieurs remarques alors affiche chaque remarque dans une ligne
          if (this.data[i]['REMARQUE'].includes(";")) {
            this.data[i]['REMARQUE'] = this.data[i]['REMARQUE'].split(';').join('\n');
          }
        }
        console.warn('data',this.data)

      }
      this.LAST_EDITABLE_ROW = this.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
      this.data=this.prestationService.sheet1;
      this.testFile = this.data;  // copy to selection
      this.files=this.data // copy to filter
      // initialize all selectedCellsState to false
      this.data.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 1 }, () => false))
      });
      this.displayedColumns.forEach(item => {
        this.getOption(item);
      })

    if (this.prestationService.sheet2) {
      this.displayedColumns2 = (Object.keys(this.prestationService.sheet2[0]));
      console.error("é/*/*/", this.displayedColumns2)
      if (!this.oneBloc) {
        this.displayedColumns2.unshift(this.displayedColumns2.pop());
        for (var i = 0; i < this.prestationService.sheet2.length; i++) {
          //si ça contient plusieurs remarques alors affiche chaque remarque dans une ligne
          if (this.prestationService.sheet2[i]['REMARQUE'].includes(";")) {
            this.prestationService.sheet2[i]['REMARQUE'] = this.prestationService.sheet2[i]['REMARQUE'].split(';').join('\n');
          }
        }
        console.warn('data', this.data)

      }
      this.LAST_EDITABLE_ROW = this.prestationService.sheet2.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns2.length - 1;
      this.data2 = this.prestationService.sheet2;
      this.testFile2 = this.prestationService.sheet2;  // copy to selection
      this.files2 = this.prestationService.sheet2 // copy to filter
      // initialize all selectedCellsState to false
      this.prestationService.sheet2.forEach(element => {
        this.selectedCellsState.push(Array.from({length: this.displayedColumns2.length - 1}, () => false))
      });
      this.displayedColumns2.forEach(item => {
        this.getOption2(item);
      })
    }

    this.test()
  }

  test() {
    console.log(this.sheet1);
    console.warn("1",this.data);
    console.warn("2",this.data2)
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
  console.warn("op1",this.options)
  }

  getOption2(filter) {
    let options = [];
    options = this.testFile2.map((item) => item[filter]);
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
  console.warn("ops2",this.options2)
  }

 /* change color of the selected column header on file livraison*/

  changeSelectedOptionColor(filter) {
    if (filter.columnProp && filter.modelValue != "") {
      document.getElementById(filter.columnProp).style.color = "#00bcd4";
    }
    else {
      document.getElementById(filter.columnProp).style.color = "white";
    }
  }

  filterChange(filter) {
      this.initSelectedCells();     // init selected cells
    console.error("files",this.files)
    console.error("filter",filter)
    this.files = this.testFile.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.files.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }
  getIntersection(filter) {
    return this.data.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  setFilteredItemsOptions(filter) {
    // check if filter is already selected

    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.files = this.filterChange(filter);
    }
    else {

      // if already another select is active merge the results
      if (filterExists == false) {

        this.data = this.getIntersection(filter)
      }
      else {
        this.data = this.files;
        this.filterValues.forEach(element => {
          this.data = this.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.data = this.data.filter((object, index) => index === this.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }

    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues.length == 0) {
        this.data = this.testFile;
        this.data = this.data.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValues.length == 1) {
        this.data = this.filterChange(this.filterValues[0])
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.data = this.testFile;
        this.filterValues.forEach(element => {
          this.data = this.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
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
      //this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseDown({ rowId: rowId, colId: colId, cellsType: cellsType });
      this.prestationService.settableMouseUp2(undefined);
      this.prestationService.settableMouseDown2(undefined);
      console.log("MOUSE 1 DOWN  ", this.prestationService.gettableMouseDown());
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
    if (this.clickCorrection == false) {
      console.log("MOUSE 1 UP  ", this.prestationService.gettableMouseUp());
      //this.tableMouseUp = { rowId: rowId, colId: colId, cellsType: cellsType };
      this.prestationService.settableMouseUp({ rowId: rowId, colId: colId, cellsType: cellsType });

      if (this.prestationService.gettableMouseDown()) {
        this.newCellValue = '';
        if (document.querySelector('td.selected') !== null) {
          document.querySelector('td.selected').classList.remove('selected');
          console.log("found selected and removed");
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
        console.log("MOUSE 1 UP 2ND ", this.prestationService.gettableMouseUp());

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
          console.log("MOUSE 2 UP  ", "found selected and removed");
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
        console.log("rrrr1111111 = ", this.copyData);
        const dataCopy = this.copyData.slice();// copy and mutate
        console.log("after slice111111     : ", dataCopy);
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
                  console.log("column : ", column);
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
        console.log(this.copyData);
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
        console.log("rrrr = ", this.copyData);
        const dataCopy = this.copyData.slice();// copy and mutate
        console.log("after slice     : ", dataCopy);
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
                  console.log("column 2: ", column);
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
          console.log('--Edit cells starting and ending not on the same column 22');

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              dataCopy[i][this.originData.columns[j]] = text;
            }
          }
        }
        console.log('--update: 22' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        this.copyData = dataCopy;
        console.log(this.copyData);
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
      console.log("ONKEY UP SHEET 1  ", this.sheet1 + " :: " + event.key);
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

      console.log("ONKEY UP SHEET 2  " + this.sheet1 + " :: " + event.key);
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
