import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  selection = new SelectionModel<any>(true, []);
  dataSource :any;
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
  showWrong: boolean = true; testFile: any;
  options: any = [];
  files: any;
  ;
  displayedColumns = [];
  filterValues: any = [];
  clickCorrection: boolean = false;
  selectedCellsState: boolean[][] = [
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
        console.log(this.copyFileWrong);
        let dataCopy = [];
        if (this.copyFileWrong.data == undefined)
        {
          dataCopy = this.copyFileWrong.slice();// copy and mutate
        }else{
          dataCopy = this.copyFileWrong.data.slice();// copy and mutate
        }
        
        
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

        this.copyFileWrong.data = dataCopy;
        console.warn('****result', this.copyFileWrong.data)

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
  public onCheckboxStateChange(changeEvent: MatCheckboxChange, id) {
    if(changeEvent.checked === true)
    {
      this.selection.select(id);
    }else{
      this.selection.deselect(id);
    }
    console.log("selection",this.selection.selected);
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
      this.dataSource = JSON.parse(JSON.stringify(this.fileWrong));
      this.dataSource.rows.splice(0, 0, this.dataSource.columns);

  // this.dataSource.columns.push('rowId');
      this.dataSource = this.convertToArrayOfObjects(this.dataSource.rows);
      this.copyFileWrong = new MatTableDataSource<any>(this.dataSource); // copyFileWrong doit etre de type MatTableDataSource pour ajouter checkbox
      this.testFile = this.dataSource;
      this.copyFileWrong.data = this.dataSource.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1); /*****sort by remaque id  */
      this.files = this.dataSource;
      this.displayedColumns=Object.keys(this.dataSource[0]);
      this.displayedColumns.splice(29, 2);  /****not display remarque id */
      this.displayedColumns.splice(1, 0, "select"); // add column select
      
      //
      this.showWrong = false;
      this.LAST_EDITABLE_ROW = this.copyFileWrong.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumns.length - 1;
      // initialize all selectedCellsState to false
      this.copyFileWrong.data.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 2 }, () => false))
      });
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
      if (item == filter && item != 'select') {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj)
      }
    })
    console.log(this.options);
  }


  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.copyFileWrong = this.filterChange(filter);
      // this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
      this.copyFileWrong = [...this.copyFileWrong, ...this.filterChange(filter)];
      this.copyFileWrong= this.copyFileWrong.filter((v,i,a)=>a.findIndex(t=>(t.rowId === v.rowId))===i);
     /******* */
      this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else{
        this.copyFileWrong=[];
        this.filterValues.forEach(element => {
          this.copyFileWrong = this.copyFileWrong.concat(this.filterChange(element));
          this.copyFileWrong= this.copyFileWrong.filter((v,i,a)=>a.findIndex(t=>(t.rowId === v.rowId))===i);
        });

      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterValues.length == 1) {
        this.copyFileWrong = this.testFile;
        this.copyFileWrong = this.copyFileWrong.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;

        })
        this.filterValues.forEach(element => {
          this.copyFileWrong = this.filterChange(element);
        });

      }

    }
    /*******modif en masse intialise seletion */
    this.copyFileWrong.forEach(element => {
      this.selectedCellsState.push(Array.from({ length: this.displayedColumns.length - 2 }, () => false))
    });
  }

  /**
   * Get lignes when filter change
   * @param filter
   */
  filterChange(filter) {
    this.files = this.files.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.files.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });

  }

  resetFiltre(){
    // deselectionner all select
    this.filterValues.forEach((value, key) => {
      value.modelValue = undefined;
    })
    this.filterValues=[];
    
    this.copyFileWrong.data = this.testFile;
    
    this.copyFileWrong = this.copyFileWrong.data.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    // console.warn(this.filterValues)
  }

  convertToArrayOfObjects(data) {
   
    var keys = data.shift(),
    
      i = 0, k = 0,
      obj = null,
      output = [];
keys.push('rowId');
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
    const prevColumn = [...this.fileWrong.columns];
    prevColumn.unshift(prevColumn.splice(this.fileWrong.columns.length-2,  1)[0]);
    // const prevColumn = [...this.fileWrong.columns]
   prevColumn.pop()
  this.fileWrong.columns = prevColumn;
    // //Deplace rows
     this.fileWrong.rows.forEach((element, index) => {
       const prevRows = [...element];
      prevRows.unshift(prevRows.splice(prevRows.length-2,  1)[0])
    //  prevRows.unshift(prevRows.splice(prevRows.length-2,  1)[0])
        // prevRows.pop()
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
    let columns=[];
    if (this.copyFileWrong.data == undefined){
      columns = Object.keys(this.copyFileWrong[0]);
    }
    else{
      columns = Object.keys(this.copyFileWrong.data[0]);
    }
   
    let rows = [];
    // console.log("copyFileWrong",this.copyFileWrong.data.length);
    if(this.testFile.length == this.copyFileWrong.data)
    {
      rows = this.copyFileWrong.data.map(Object.values);
    }else
    {
      let arrayFileToCorrect = [];
      this.testFile.forEach((element) => {
        if (this.copyFileWrong.data !== undefined){
          if(this.copyFileWrong.data.indexOf(element) === -1)
          {
            arrayFileToCorrect.push(element)
          }
        }
        else {
          if(this.copyFileWrong.indexOf(element) === -1)
          {
            arrayFileToCorrect.push(element)
          }
        }
      
        
      });

      /********* to check .data */
      if(this.copyFileWrong.data !== undefined){
        arrayFileToCorrect = arrayFileToCorrect.concat(this.copyFileWrong.data);
      }
      else if (this.copyFileWrong.data == undefined) {
        arrayFileToCorrect = arrayFileToCorrect.concat(this.copyFileWrong);
      }
    
      rows = arrayFileToCorrect.map(Object.values);

    }
    
    this.fileWrongUpdated = {
      columns: columns,
      rows: rows
    }
    this._fileWrong = JSON.parse(JSON.stringify(this.fileWrongUpdated));
    if(document.querySelector('.selected'))
    {
      document.querySelector('.selected').classList.remove('selected');
    }
    
    this._fileWrong.rows.forEach(element => {
      // console.warn('//**/*///*element',element[el])
      element.shift(); // remove remarque
     

      // element.pop();
      if(this.selection.selected.includes(element[element.length-1])){ // this.selection.selected est un array qui contient les indices des lignes du tableau séléctionnées.
        element.push(1); // add true (c'est à dire la ligne du tableau est séléctionnées)
      }else{
        element.push(0); // add fales (c'est à dire la ligne du tableau n'est pas séléctionnées)
      }
      element.splice(element.length-3,2); // remove rows remarque_id & rowId
    });
    
    this._fileWrong.columns.push('selected'); //add column selected
    this._fileWrong.columns.splice(this._fileWrong.columns.length-3,2);// remove column row id

    
    if (this.fileWrong && this.fileValid) {
      // boucle pour ajouter false à toutes les lignes du tableau fileValid
      this.fileValid.rows.forEach(element => {
        element.push(0);
      });
      this.fileTocheck = {
        fileId: this.file.idFile,
      //  columns: this._fileWrong.columns.splice(this._fileWrong.columns.length-2, 1),
       columns: this._fileWrong.columns.splice(1),
        rows: this.fileValid.rows.concat(this._fileWrong.rows),
      }
    }
    else {
      this.fileTocheck = {
        fileId: this.file.idFile,
       // columns: this._fileWrong.columns.splice(this._fileWrong.columns.length-2, 1),
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
