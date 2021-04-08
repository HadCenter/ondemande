import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';

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
  file: any;
  fileWrong: any = [];
  fileValid: any;
  column: string;
  public snackAction = 'Ok';
  fileTocheck: { fileId: any; columns: any; rows: any; };
  _fileWrong: any;
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 1;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  newCellValue: string = '';
  showValid = true;
  copyFileWrong: any;
  fileWrongUpdated: any = [];
  showWrong: boolean = true;;
  displayedColumns = [];
  clickCorrection: boolean = false;
  selectedCellsState: boolean[][] = [
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
    // [false, false, false],
  ];

  constructor(private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fileService: DetailsFileEdiService) {
    super();

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
        console.warn(dataCopy)
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
          console.log('--Edit cells from the same column');
          for (let i = startRow; i <= endRow; i++) {
            console.log(dataCopy[i], [this.fileWrong.columns[startCol]])
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
        console.warn('****result', this.copyFileWrong)

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
    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        this.selectedCellsState[i][j] = false;

      }
    }
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

  ngOnInit(): void {
    this.getFile(this.route.snapshot.params.id);
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
      this.MoveLastElementToTheStart();
      //create a copy array of object from the res and an array of displayed column 
      this.copyFileWrong = JSON.parse(JSON.stringify(this.fileWrong));
      this.copyFileWrong.rows.splice(0, 0, this.copyFileWrong.columns);
      this.copyFileWrong = this.convertToArrayOfObjects(this.copyFileWrong.rows);
      this.displayedColumns = (Object.keys(this.copyFileWrong[0]))
      //
      this.showWrong = false;
      this.LAST_EDITABLE_ROW = this.copyFileWrong.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
      // initialize all selectedCellsState to false
      this.copyFileWrong.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 2 }, () => false))
      });

    })

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

  MoveLastElementToTheStart() {
    //Deplace column 
    const prevColumn = [...this.fileWrong.columns]
    prevColumn.unshift(prevColumn.pop())
    this.fileWrong.columns = prevColumn;
    //Deplace rows
    this.fileWrong.rows.forEach((element, index) => {
      const prevRows = [...element]
      prevRows.unshift(prevRows.pop())
      this.fileWrong.rows[index] = prevRows;
    });
    console.warn('***filewrong', this.fileWrong);
  }

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileValid = res;
      this.showValid = false;
      console.warn('***filevalid', this.fileValid)
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

  correctionFile() {
    this.clickCorrection = true;
    let columns = Object.keys(this.copyFileWrong[0]);
    let rows = this.copyFileWrong.map(Object.values);
    this.fileWrongUpdated = {
      columns: columns,
      rows: rows
    }
    this._fileWrong = JSON.parse(JSON.stringify(this.fileWrongUpdated));
    //Disable input after click on correction

    // var inputs = document.getElementsByTagName("input");
    // for (var i = 0; i < inputs.length; i++) {
    //   inputs[i].disabled = true;
    // }
    
    document.querySelector('.selected').classList.remove('selected');
    this._fileWrong.rows.forEach(element => {
      element = element.shift();
    });
    if (this.fileWrong && this.fileValid) {

      this.fileTocheck = {
        fileId: this.file.idFile,
        columns: this._fileWrong.columns.splice(1),
        rows: this.fileValid.rows.concat(this._fileWrong.rows),
      }
    }
    else {
      this.fileTocheck = {
        fileId: this.file.idFile,
        columns: this._fileWrong.columns.splice(1),
        rows: this._fileWrong.rows,
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
      // panelClass: ['blue-snackbar']
    });
  }


}
