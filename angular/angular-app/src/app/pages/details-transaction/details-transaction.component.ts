import { AfterViewInit, Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';

export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}

@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit, AfterViewInit {
  fichierException: any = [];
  fichierMad: any = [];
  fichierMetadata: any = [];
  fichierLivraison: any = [];
  arrayLivraison: any = [];
  displayedColumnsLivraison: any = [];
  transaction: any;
  displayedColumnsException: any = [];
  displayedColumnsMad: any = [];
  displayedColumnsMetadata: any = [];
  options: any = [];
  optionsException: any = [];
  optionsMetaData: any = [];
  optionsMad: any = [];

  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 0;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  newCellValue: string = '';
  clickCorrection: boolean = false;
  selectedCellsState: boolean[][] = [];
  selectedCellsStateException: boolean[][] = [];
  selectedCellsStateMetaData: boolean[][] = [];
  selectedCellsStateMad: boolean[][] = [];

  public snackAction = 'Ok';
  filterValues: any = [];
  filterExceptionValues: any = [];
  filterMetaDataValues: any = [];
  filterMadValues: any = [];
  copySelectionLivraison: any = [];
  copyFilterLivraison: any = [];
  copySelectionException: any = [];
  copyFilterException: any = [];
  copySelectionMetaData: any = [];
  copyFilterMetaData: any = [];
  copySelectionMad: any = [];
  copyFilterMad: any = [];
  rowsFichierLivraison: any = [];
  fileTocheck: { transaction_id: any; fileReplacement: { columns: any; rows: any; } };
  arrayException: any = [];
  arrayMetaData: any = [];
  arrayMad: any = [];
  fileSelected: any;
  showLoaderLivraisonFile = true;
  showLoaderExceptionFile = true;
  showLoaderMetadataFile = true;
  showLoaderMadFile = true;
  public filterValueLivraison: any;
  public filterValueException: any;
  public filterValueMad: any;
  public filterValuemetadata: any;

  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
    private _snackBar: MatSnackBar, private router: Router,) { super(); }

  ngOnInit(): void {
    this.service.getDetailTransaction(this.route.snapshot.params.id).subscribe(res => {
      this.transaction = res;
    })
    var data = { "transaction_id": parseInt(this.route.snapshot.params.id) };
    this.service.seeAllFileTransaction(data).subscribe(res => {
      console.warn(res);
      this.fichierLivraison = res.livraison;
      this.arrayLivraison = res.livraison;
      this.fichierException = res.exception;
      this.arrayException = res.exception;
      this.fichierMad = res.mad;
      this.arrayMad = res.mad;
      this.fichierMetadata = res.metadata;
      this.arrayMetaData = res.metadata;
      this.rearrangeFileLivraison();
      this.rearrangeFileException();
      this.rearrangeFileMetadata();
      this.rearrangeFileMAD();
    })
  }
    /**** Filter items */
  setFilteredItemsLivraison() {
    this.fichierLivraison = this.filterItemsLivraison(this.filterValueLivraison);
    if (this.filterValueLivraison === '') {
      this.fichierLivraison = this.fichierLivraison;
    }
  }
  
  filterItemsLivraison(filterValueLivraison : string) {
    return this.copyFilterLivraison.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValueLivraison.toLowerCase());
    });
  }
    /**** Filter items */
  setFilteredItemsException() {
    this.fichierException = this.filterItemsException(this.filterValueException);
    if (this.filterValueException === '') {
      this.fichierException = this.fichierException;
    }
  }
  
  filterItemsException(filterItemsException : string) {
    return this.copyFilterException.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterItemsException.toLowerCase());
    });
  }
    /**** Filter items */
  setFilteredItemsMetadata() {
    this.fichierMetadata = this.filterItemsMetadata(this.filterValuemetadata);
    if (this.filterValuemetadata === '') {
      this.fichierMetadata = this.fichierMetadata;
    }
  }
  
  filterItemsMetadata(filterItemsMetadata : string) {
    return this.copyFilterMetaData.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterItemsMetadata.toLowerCase());
    });
  }
    /**** Filter items */
  setFilteredItemsMAD() {
    this.fichierMad = this.filterItemsMAD(this.filterValueMad);
    if (this.filterValueMad === '') {
      this.fichierMad = this.fichierMad;
    }
  }
  
  filterItemsMAD(filterItemsMAD : string) {
    return this.copyFilterMad.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterItemsMAD.toLowerCase());
    });
  }
  rearrangeFileLivraison() {
    if (this.fichierLivraison.rows.length > 0) {
      this.fichierLivraison.rows.splice(0, 0, this.fichierLivraison.columns);
      this.fichierLivraison = this.convertToArrayOfObjects(this.fichierLivraison.rows);
      this.fichierLivraison = this.fichierLivraison.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      this.copySelectionLivraison = this.fichierLivraison;   //copy to use on selection
      this.copyFilterLivraison = this.fichierLivraison;    // copy to filter *
      this.displayedColumnsLivraison = Object.keys(this.fichierLivraison[0]);
       // initialize all selectedCellsState to false
       this.fichierLivraison.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: Object.keys(this.fichierLivraison[0]).length - 1 }, () => false))
      });
      this.displayedColumnsLivraison.splice(0,3);

      // get select options
      this.displayedColumnsLivraison.forEach(item => {
        this.getOption(item);
      })
      this.showLoaderLivraisonFile = false;
    }
    else {
      this.showLoaderLivraisonFile = false;
    }
  }

  rearrangeFileException() {
    if (this.fichierException.rows.length > 0) {
      this.fichierException.rows.splice(0, 0, this.fichierException.columns);
      this.fichierException = this.convertToArrayOfObjects(this.fichierException.rows);
      this.copySelectionException = this.fichierException;   //copy to use on selection
      this.copyFilterException = this.fichierException;    // copy to filter *
      this.displayedColumnsException = Object.keys(this.fichierException[0]);
   
      // initialize all selectedCellsState to false
      this.fichierException.forEach(element => {
        this.selectedCellsStateException.push(Array.from({ length: this.displayedColumnsException.length - 1 }, () => false))
      });
      this.displayedColumnsException.splice(0,3);
      // get select options
      this.displayedColumnsException.forEach(item => {
        this.getOptionException(item);
      })
      this.showLoaderExceptionFile = false;
    }
    else {
      this.showLoaderExceptionFile = false;
    }
  }

  rearrangeFileMAD() {
    if (this.fichierMad.rows.length > 0) {

      this.fichierMad.rows.splice(0, 0, this.fichierMad.columns);
      this.fichierMad = this.convertToArrayOfObjects(this.fichierMad.rows);
      this.copySelectionMad = this.fichierMad;   //copy to use on selection
      this.copyFilterMad = this.fichierMad;    // copy to filter *
      this.displayedColumnsMad = Object.keys(this.fichierMad[0]);
      // initialize all selectedCellsState to false
      this.fichierMad.forEach(element => {
        this.selectedCellsStateMad.push(Array.from({ length: this.displayedColumnsMad.length - 1 }, () => false))
      });
      this.displayedColumnsMad.splice(0,3);
      // get select options
      this.displayedColumnsMad.forEach(item => {
        this.getOptionMad(item);
      })
      this.showLoaderMadFile = false;
    }
    else {
      this.showLoaderMadFile = false;
    }
  }


  rearrangeFileMetadata() {
    if (this.fichierMetadata.rows.length > 0) {
      this.fichierMetadata.rows.splice(0, 0, this.fichierMetadata.columns);
      this.fichierMetadata = this.convertToArrayOfObjects(this.fichierMetadata.rows);
      this.copySelectionMetaData = this.fichierMetadata;   //copy to use on selection
      this.copyFilterMetaData = this.fichierMetadata;    // copy to filter *
      this.displayedColumnsMetadata = Object.keys(this.fichierMetadata[0]);
      // initialize all selectedCellsState to false
      this.fichierMetadata.forEach(element => {
        this.selectedCellsStateMetaData.push(Array.from({ length: this.displayedColumnsMetadata.length - 1 }, () => false))
      });
      this.displayedColumnsMetadata.splice(0,3);
      // get select options
      this.displayedColumnsMetadata.forEach(item => {
        this.getOptionMetaData(item);
      })
      this.showLoaderMetadataFile = false;
    }
    else {
      this.showLoaderMetadataFile = false;
    }
  }

  /**
   * Get options inside selects for Livraison
   * @param filter
   */
  getOption(filter) {
    let options = [];
    options = this.fichierLivraison.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {
      return options.indexOf(value) == index && value != "";
    });

    this.displayedColumnsLivraison.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj)
      }
    })
  }

  /**
  * Get options inside selects for Exception
  * @param filter
  */
  getOptionException(filter) {
    let optionsException = [];
    optionsException = this.fichierException.map((item) => item[filter]);
    optionsException = optionsException.filter(function (value, index, optionsException) {
      return optionsException.indexOf(value) == index && value != "";
    });

    this.displayedColumnsException.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsException
        };
        this.optionsException.push(obj)
      }
    })
    console.warn(this.optionsException);
  }

  /**
   * Get options inside selects for MetaData
   * @param filter
   */
  getOptionMetaData(filter) {
    let optionsMetaData = [];
    optionsMetaData = this.fichierMetadata.map((item) => item[filter]);
    optionsMetaData = optionsMetaData.filter(function (value, index, optionsMetaData) {
      return optionsMetaData.indexOf(value) == index && value != "";
    });

    this.displayedColumnsMetadata.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsMetaData
        };
        this.optionsMetaData.push(obj)
      }
    })
  }

  /**
    * Get options inside selects for MAD
    * @param filter
    */
  getOptionMad(filter) {
    let optionsMad = [];
    optionsMad = this.fichierMad.map((item) => item[filter]);
    optionsMad = optionsMad.filter(function (value, index, optionsMad) {
      return optionsMad.indexOf(value) == index && value != "";
    });

    this.displayedColumnsMad.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsMad
        };
        this.optionsMad.push(obj)
      }
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

  /**
* Initialise the selected cells
*/
  initSelectedCells() {
    if (this.fileSelected == "livraison") {
      this.LAST_EDITABLE_ROW = this.fichierLivraison.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsLivraison.length - 1;
    }
    else if (this.fileSelected == "exception") {
      this.LAST_EDITABLE_ROW = this.fichierException.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsException.length - 1;
    }
    else if (this.fileSelected == "metadata") {
      this.LAST_EDITABLE_ROW = this.fichierMetadata.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMetadata.length - 1;
    }
    else {   // Fichier MAD
      this.LAST_EDITABLE_ROW = this.fichierMad.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMad.length - 1;
    }

    for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
      for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
        if (this.fileSelected == "livraison") {
          this.selectedCellsState[i][j] = false;
        }
        else if (this.fileSelected == "exception") {
          this.selectedCellsStateException[i][j] = false;
        }
        else if (this.fileSelected == "metadata") {
          this.selectedCellsStateMetaData[i][j] = false;
        }
        else {   //Fichier MAD
          this.selectedCellsStateMad[i][j] = false;
        }
      }
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
        if (this.fileSelected == "livraison") {
          this.selectedCellsState[i][j] = true;
        }
        else if (this.fileSelected == "exception") {
          this.selectedCellsStateException[i][j] = true;
        }
        else if (this.fileSelected == "metadata") {
          this.selectedCellsStateMetaData[i][j] = true;
        }
        else {
          this.selectedCellsStateMad[i][j] = true;
        }
      }
    }
  }

  updateSelectedCellsValues(text: string) {
    let dataCopy;
    if (text == null) { return; }

    if (this.tableMouseDown && this.tableMouseUp) {
      if (this.tableMouseDown.cellsType === this.tableMouseUp.cellsType) {
        //convert every rows to object
        if (this.fileSelected == "livraison") {
          dataCopy = this.fichierLivraison.slice();// copy and mutate
        }
        else if (this.fileSelected == "exception") {
          dataCopy = this.fichierException.slice();// copy and mutate
        }
        else if (this.fileSelected == "metadata") {
          dataCopy = this.fichierMetadata.slice();// copy and mutate
        }
        else {
          dataCopy = this.fichierMad.slice();// copy and mutate
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
          console.log("fichier livraison", this.fichierLivraison)
          for (let i = startRow; i <= endRow; i++) {
            if (this.fileSelected == "livraison") {

              dataCopy[i][this.displayedColumnsLivraison[startCol]] = text;
            }
            else if (this.fileSelected == "exception") {
              dataCopy[i][this.displayedColumnsException[startCol]] = text;
            }
            else if (this.fileSelected == "metadata") {
              dataCopy[i][this.displayedColumnsMetadata[startCol]] = text;
            }
            else {
              dataCopy[i][this.displayedColumnsMetadata[startCol]] = text;
            }
          }
        } else {
          //--Edit cells starting and ending not on the same column
          console.log('--Edit cells starting and ending not on the same column');
          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              if (this.fileSelected == "livraison") {
                dataCopy[i][this.displayedColumnsLivraison[j]] = text;
              }
              else if (this.fileSelected == "exception") {
                dataCopy[i][this.displayedColumnsException[j]] = text;
              }
              else if (this.fileSelected == "metadata") {
                dataCopy[i][this.displayedColumnsMetadata[j]] = text;
              }
              else {
                dataCopy[i][this.displayedColumnsMad[j]] = text;
              }
            }
          }
        }
        console.log('--update: ' + startRow + ', ' + startCol + ' to ' + endRow + ', ' + endCol);

        if (this.fileSelected == "livraison") {
          this.fichierLivraison = dataCopy;
        }
        else if (this.fileSelected == "exception") {
          this.fichierException = dataCopy;
        }
        else if (this.fileSelected == "metadata") {
          this.fichierMetadata = dataCopy;
        }
        else {
          this.fichierMad = dataCopy;
        }
      } else {
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'OK');
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
  onMouseUp(rowId: number, colId: number, cellsType: string, file) {
    this.fileSelected = file;  // update the file selected
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

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }

  setFilteredItemsMetaDataOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterMetaDataValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterMetaDataValues.push(filter) }
    // if only one select is selected
    if (this.filterMetaDataValues.length == 1) {
      this.fichierMetadata = this.filterMetaDataChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.fichierMetadata = [...this.fichierMetadata, ...this.filterMetaDataChange(filter)];
        //delete doublon
        this.fichierMetadata = this.fichierMetadata.filter((object, index) => index === this.fichierMetadata.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.fichierMetadata = this.fichierMetadata.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.fichierMetadata = [];
        this.filterMetaDataValues.forEach(element => {
          this.fichierMetadata = this.fichierMetadata.concat(this.filterMetaDataChange(element));
        });
        //delete doublon
        this.fichierMetadata = this.fichierMetadata.filter((object, index) => index === this.fichierMetadata.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterMetaDataValues.length == 1) {
        this.fichierMetadata = this.copySelectionMetaData;
        this.fichierMetadata = this.fichierMetadata.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterMetaDataValues = this.filterMetaDataValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterMetaDataValues.forEach(element => {
          this.fichierMetadata = this.filterMetaDataChange(element)
        });
      }
    }

  }

  setFilteredItemsMadOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterMadValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterMadValues.push(filter) }
    // if only one select is selected
    if (this.filterMadValues.length == 1) {
      this.fichierMad = this.filterMadChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.fichierMad = [...this.fichierMad, ...this.filterMadChange(filter)];
        //delete doublon
        this.fichierMad = this.fichierMad.filter((object, index) => index === this.fichierMad.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.fichierMad = this.fichierMad.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.fichierMad = [];
        this.filterMadValues.forEach(element => {
          this.fichierMad = this.fichierMad.concat(this.filterMadChange(element));
        });
        //delete doublon
        this.fichierMad = this.fichierMad.filter((object, index) => index === this.fichierMad.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterMadValues.length == 1) {
        this.fichierMad = this.copySelectionMad;
        this.fichierMad = this.fichierMad.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterMadValues = this.filterMadValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterMadValues.forEach(element => {
          this.fichierMad = this.filterMadChange(element)
        });
      }
    }

  }

  setFilteredItemsExceptionOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterExceptionValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterExceptionValues.push(filter) }
    // if only one select is selected
    if (this.filterExceptionValues.length == 1) {
      this.fichierException = this.filterExceptionChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.fichierException = [...this.fichierException, ...this.filterExceptionChange(filter)];
        //delete doublon
        this.fichierException = this.fichierException.filter((object, index) => index === this.fichierException.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.fichierException = this.fichierException.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.fichierException = [];
        this.filterExceptionValues.forEach(element => {
          this.fichierException = this.fichierException.concat(this.filterExceptionChange(element));
        });
        //delete doublon
        this.fichierException = this.fichierException.filter((object, index) => index === this.fichierException.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterExceptionValues.length == 1) {
        this.fichierException = this.copySelectionException;
        this.fichierException = this.fichierException.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterExceptionValues = this.filterExceptionValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterExceptionValues.forEach(element => {
          this.fichierException = this.filterExceptionChange(element)
        });
      }
    }

  }

  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.fichierLivraison = this.filterChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.fichierLivraison = [...this.fichierLivraison, ...this.filterChange(filter)];
        //delete doublon
        this.fichierLivraison = this.fichierLivraison.filter((object, index) => index === this.fichierLivraison.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.fichierLivraison = this.fichierLivraison.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.fichierLivraison = [];
        this.filterValues.forEach(element => {
          this.fichierLivraison = this.fichierLivraison.concat(this.filterChange(element));
        });
        //delete doublon
        this.fichierLivraison = this.fichierLivraison.filter((object, index) => index === this.fichierLivraison.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterValues.length == 1) {
        this.fichierLivraison = this.copySelectionLivraison;
        this.fichierLivraison = this.fichierLivraison.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterValues.forEach(element => {
          this.fichierLivraison = this.filterChange(element)
        });
      }
    }

  }

  /**
* Get lignes when filter mad change
* @param filter
*/
  filterMadChange(filter) {
    this.fileSelected = "mad";
    this.initSelectedCells();     // init selected cells
    this.copySelectionMad = this.copySelectionMad.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    return this.copySelectionMad.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }

  /**
* Get lignes when filter metadata change
* @param filter
*/
  filterMetaDataChange(filter) {
    this.fileSelected = "metadata";
    this.initSelectedCells();     // init selected cells
    this.copySelectionMetaData = this.copySelectionMetaData.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    return this.copySelectionMetaData.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }
  /**
 * Get lignes when filter exception change
 * @param filter
 */
  filterExceptionChange(filter) {
    this.fileSelected = "exception";
    this.initSelectedCells();     // init selected cells
    this.copySelectionException = this.copySelectionException.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    return this.copySelectionException.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }

  /**
   * Get lignes when filter livraison change
   * @param filter
   */
  filterChange(filter) {
    this.fileSelected = "livraison";
    this.initSelectedCells();     // init selected cells
    this.copySelectionLivraison = this.copySelectionLivraison.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    return this.copySelectionLivraison.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }

  /**
* Reset filter
*/
  resetFiltre(file) {
    // this.initSelectedCells();    // init selected cells
    if (file == "livraison") {
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
      this.fichierLivraison = this.copySelectionLivraison;
      this.filterValues = [];
      this.fichierLivraison = this.fichierLivraison.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    }
    else if (file == "exception") {

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateException[i][j] = false;
        }

      }
      // reset the selected filtre
      this.optionsException.forEach(element => {
        if (element.hasOwnProperty("modelValue")) {
          element.modelValue = ""
        }
      })
      this.fichierException = this.copySelectionException;
      this.filterExceptionValues = [];
      this.fichierException = this.fichierException.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    }
    else if (file == "metadata") {

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMetaData[i][j] = false;
        }

      }
      // reset the selected filtre
      this.optionsMetaData.forEach(element => {
        if (element.hasOwnProperty("modelValue")) {
          element.modelValue = ""
        }
      })
      this.fichierMetadata = this.copySelectionMetaData;
      this.filterMetaDataValues = [];
      this.fichierMetadata = this.fichierMetadata.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    }

    else { //MAD
      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMad[i][j] = false;
        }
      }
      // reset the selected filtre
      this.optionsMad.forEach(element => {
        if (element.hasOwnProperty("modelValue")) {
          element.modelValue = ""
        }
      })
      this.fichierMad = this.copySelectionMad;
      this.filterMadValues = [];
      this.fichierMad = this.fichierMad.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    }

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
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
* Correct the file
*/
  correctionFile(index) {
    this.clickCorrection = true;

    // this.initSelectedCells();
    this.hideUiSelectionOnCorrection();  //hide ui selection on correction
    if (index == "livraison") {  // correction file livraison
      this.LAST_EDITABLE_ROW = this.fichierLivraison.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsLivraison.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsState[i][j] = false;

        }
      }
      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: this.arrayLivraison.columns,
          rows: this.copyFilterLivraison.map(Object.values),
        }

      }

      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctLivraisonFile(this.fileTocheck).subscribe(res => {
        console.log('resultat correction exception', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    else if (index == "exception") {  // correction file exception
      this.LAST_EDITABLE_ROW = this.fichierException.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsException.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateException[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: this.arrayException.columns,
          rows: this.copyFilterException.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctExceptionFile(this.fileTocheck).subscribe(res => {
        console.log('resultat correction exception', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    else if (index == "metadata") { // correction file metadata
      this.LAST_EDITABLE_ROW = this.fichierMetadata.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMetadata.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMetaData[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: this.arrayMetaData.columns,
          rows: this.copyFilterMetaData.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctMetaDataFile(this.fileTocheck).subscribe(res => {
        console.log('resultat correction metadata', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }

    else {  // correction file MAD
      this.LAST_EDITABLE_ROW = this.fichierMad.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMad.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMad[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: this.arrayMad.columns,
          rows: this.copyFilterMad.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctMadFile(this.fileTocheck).subscribe(res => {
        console.log('resultat correction mad', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    console.warn("**file to check**", this.fileTocheck)
  }


}


