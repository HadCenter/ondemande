import { AfterViewInit, Component, OnInit, HostListener, ViewChild, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


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
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit {
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  fichierException: any = [];
  fichierLivraison: any = [];
  fichierMad: any = [];
  fichierMetadata: any = [];
  displayedColumnsLivraison: string[] = ['Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name'];
  displayedColumnsException: string[] = ['Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom', 'Item___Type', 'Item___Quantite', 'Code_postal', 'Round_Name', 'Remarque', 'isDeleted'];
  displayedColumnsMetadata: string[] = ['Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name', 'sourceClosureDate', 'realInfoHasPrepared', 'status', 'metadataFACTURATION'];
  displayedColumnsMad: string[] = ['Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name'];
  dataSource = new MatTableDataSource<any>(this.fichierLivraison);
  dataSourceException = new MatTableDataSource<any>(this.fichierException);
  dataSourceMetaData = new MatTableDataSource<any>(this.fichierMetadata);
  dataSourceMAD = new MatTableDataSource<any>(this.fichierMad);
  selection: any[] = [];
  selectionEception: any[] = [];
  selectionMetadata: any[] = [];
  selectionMad: any[] = [];
  // @ViewChildren("cell", { read: ElementRef }) cells: QueryList<ElementRef>;
  // @ViewChildren("cellException", { read: ElementRef }) cellsException: QueryList<ElementRef>;
  // @ViewChildren("cellMetadata", { read: ElementRef }) cellsMetadata: QueryList<ElementRef>;
  // @ViewChildren("cellMad", { read: ElementRef }) cellsMad: QueryList<ElementRef>;
  newCellValue: string = '';
  newCellValueException: string = '';
  newCellValueMetadata: string = '';
  newCellValueMad: string = '';
  arrayLivraison: any = [];
  arrayException: any = [];
  arrayMetaData: any = [];
  arrayMad: any = [];
  showLoaderLivraisonFile = true;
  showLoaderExceptionFile = true;
  showLoaderMetadataFile = true;
  showLoaderMadFile = true;
  public snackAction = 'Ok';
  copyFilterLivraison: any = [];
  copyFilterException: any = [];
  copyFilterMetaData: any = [];
  copyFilterMad: any = [];
  fileTocheck: any;
  fileTocheckException: any;
  fileTocheckMetadata: any;
  fileTocheckMad: any;
  transaction: any;
  selectedCellsState: boolean[][] = [];
  selectedCellsStateException: boolean[][] = [];
  selectedCellsStateMetaData: boolean[][] = [];
  selectedCellsStateMad: boolean[][] = [];
  fileSelected: any;
  options: any = [];
  optionsException: any = [];
  optionsMetaData: any = [];
  optionsMad: any = [];
  filterValues: any = [];
  filterExceptionValues: any = [];
  filterMetaDataValues: any = [];
  filterMadValues: any = [];
  tableMouseDown: MouseEvent;
  tableMouseUp: MouseEvent;
  FIRST_EDITABLE_ROW: number = 0;
  LAST_EDITABLE_ROW: number = 0;
  FIRST_EDITABLE_COL: number = 0;                       // first column is not editable --> so start from index 1
  LAST_EDITABLE_COL: number = 0;
  copySelectionLivraison: any = [];
  copySelectionException: any = [];
  copySelectionMetaData: any = [];
  copySelectionMad: any = [];
  clickCorrection: boolean = false;
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

      if (res.livrasion !==null && Object.keys(res.livraison).length === 0 ){
      this.dataSource.paginator = this.paginator.toArray()[0];
      this.arrayLivraison = res.livraison;
      this.dataSource.data = this.arrayLivraison.fileContent;
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.copySelectionLivraison = this.dataSource.data  //copy to use on selection
      this.copyFilterLivraison = this.dataSource.data ;
      this.dataSource.data.forEach(element => {
        this.selectedCellsState.push(Array.from({ length: Object.keys(this.dataSource.data[0]).length - 1 }, () => false))
      });
      // get select options
      this.displayedColumnsLivraison.forEach(item => {
        this.getOption(item);
      })
      
    }
    if (res.exception !==null && Object.keys(res.exception).length === 0 ){
      this.dataSourceException.paginator = this.paginator.toArray()[1];
      this.arrayException = res.exception;
      this.dataSourceException.data = this.arrayException.fileContent;
      this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.copySelectionException = this.dataSourceException.data  //copy to use on selection
      this.copyFilterException= this.dataSourceException.data ;
      this.dataSourceException.data.forEach(element => {
        this.selectedCellsStateException.push(Array.from({ length: Object.keys(this.dataSourceException.data[0]).length - 1 }, () => false))
      });
      // get select options
      this.displayedColumnsException.forEach(item => {
        this.getOptionException(item);
      })
    }

    if (res.metadata !==null && Object.keys(res.metadata).length === 0 ){
      this.dataSourceMetaData.paginator = this.paginator.toArray()[2];
      this.arrayMetaData = res.metadata;
      this.dataSourceMetaData.data = this.arrayMetaData.fileContent;
      this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.copySelectionMetaData = this.dataSourceMetaData.data  //copy to use on selection
      this.copyFilterMetaData= this.dataSourceMetaData.data;
      this.dataSourceMetaData.data.forEach(element => {
        this.selectedCellsStateMetaData.push(Array.from({ length: Object.keys(this.dataSourceMetaData.data[0]).length - 1 }, () => false))
      });
      // get select options
      this.displayedColumnsMetadata.forEach(item => {
        this.getOptionMetaData(item);
      })
    }

if (res.mad !==null && Object.keys(res.mad).length === 0 ){
      this.dataSourceMAD.paginator = this.paginator.toArray()[3];
      this.arrayMad = res.mad;
      this.dataSourceMAD.data = this.arrayMad.fileContent;
      this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.copySelectionMad = this.dataSourceMAD.data  //copy to use on selection
      this.copyFilterMad= this.dataSourceMAD.data;
      this.dataSourceMAD.data.forEach(element => {
        this.selectedCellsStateMad.push(Array.from({ length: Object.keys(this.dataSourceMAD.data[0]).length - 1 }, () => false))
      });
      // get select options
      this.displayedColumnsMad.forEach(item => {
        this.getOptionMAD(item);
      })
    }

      this.showLoaderLivraisonFile = false;
      this.showLoaderExceptionFile = false;
      this.showLoaderMetadataFile = false;
      this.showLoaderMadFile = false;
    })

  }

  /**
  * Get options inside selects for MetaData
  * @param filter
  */
  getOptionMetaData(filter) {
    let optionsMetaData = [];
    optionsMetaData = this.arrayMetaData.options[filter];
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
  getOptionMAD(filter) {
    let optionsMad = [];
    optionsMad = this.arrayMad.options[filter]
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


  /**
* Reset filter
*/
  resetFiltre(file) {
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
      this.dataSource.data = this.copySelectionLivraison;
      this.filterValues = [];
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
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
      this.dataSourceException.data = this.copySelectionException;
      this.filterExceptionValues = [];
      this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
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
      this.dataSourceMetaData.data = this.copySelectionMetaData;
      this.filterMetaDataValues = [];
      this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
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
      this.dataSourceMAD.data = this.copySelectionMad;
      this.filterMadValues = [];
      this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
    }

  }
  /**
  * Get options inside selects for Livraison
  * @param filter
  */
  getOption(filter) {
    let options = [];
    options = this.arrayLivraison.options[filter]
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

  getOptionException(filter) {
    let optionsException = [];
    optionsException = this.arrayException.options[filter]
    this.displayedColumnsException.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: optionsException
        };
        this.optionsException.push(obj)
      }
    })
  }

  /**
 * Get lignes when filter livraison change
 * @param filter
 */
  filterChange(filter) {
    this.fileSelected = "livraison";
    this.initSelectedCells();     // init selected cells
    this.copySelectionLivraison = this.copySelectionLivraison.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
    return this.copySelectionLivraison.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }


    /**** Filter items */
    setFilteredItemsLivraison() {
      this.dataSource.data = this.filterItemsLivraison(this.filterValueLivraison);
      if (this.filterValueLivraison === '') {
        this.dataSource.data= this.dataSource.data;
      }
    }
  
    filterItemsLivraison(filterValueLivraison : string) {
      return this.copyFilterLivraison.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterValueLivraison.toLowerCase());
      });
    }

     /**** Filter items */
  setFilteredItemsException() {
    this.dataSourceException.data = this.filterItemsException(this.filterValueException);
    if (this.filterValueException === '') {
      this.dataSourceException.data = this.dataSourceException.data;
    }
  }

    /**** Filter items */
    setFilteredItemsMetadata() {
      this.dataSourceMetaData.data = this.filterItemsMetadata(this.filterValuemetadata);
      if (this.filterValuemetadata === '') {
        this.dataSourceMetaData.data = this.dataSourceMetaData.data;
      }
    }
  
    filterItemsMetadata(filterItemsMetadata : string) {
      return this.copyFilterMetaData.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMetadata.toLowerCase());
      });
    }
      /**** Filter items */
    setFilteredItemsMAD() {
      this.dataSourceMAD.data = this.filterItemsMAD(this.filterValueMad);
      if (this.filterValueMad === '') {
        this.dataSourceMAD.data = this.dataSourceMAD.data;
      }
    }
  
    filterItemsMAD(filterItemsMAD : string) {
      return this.copyFilterMad.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMAD.toLowerCase());
      });
    }

  filterItemsException(filterItemsException : string) {
    return this.copyFilterException.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterItemsException.toLowerCase());
    });
  }
  /**
* Initialise the selected cells
*/
  initSelectedCells() {
    if (this.fileSelected == "livraison") {
      this.LAST_EDITABLE_ROW = this.dataSource.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsLivraison.length - 1;
    }
    else if (this.fileSelected == "exception") {
      this.LAST_EDITABLE_ROW = this.dataSourceException.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsException.length - 1;
    }
    else if (this.fileSelected == "metadata") {
      this.LAST_EDITABLE_ROW = this.dataSourceMetaData.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMetadata.length - 1;
    }
    else {   // Fichier MAD
      this.LAST_EDITABLE_ROW = this.dataSourceMAD.data.length - 1;
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
  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.dataSource.data = this.filterChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSource.data = [...this.dataSource.data, ...this.filterChange(filter)];
        //delete doublon
        this.dataSource.data = this.dataSource.data.filter((object, index) => index === this.dataSource.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else {
        this.dataSource.data = [];
        this.filterValues.forEach(element => {
          this.dataSource.data = this.dataSource.data.concat(this.filterChange(element));
        });
        //delete doublon
        this.dataSource.data = this.dataSource.data.filter((object, index) => index === this.dataSource.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterValues.length == 1) {
        this.dataSource.data = this.copySelectionLivraison;
        this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterValues.forEach(element => {
          this.dataSource.data = this.filterChange(element)
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
      this.dataSourceException.data = this.filterExceptionChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceException.data = [...this.dataSourceException.data, ...this.filterExceptionChange(filter)];
        //delete doublon
        this.dataSourceException.data = this.dataSourceException.data.filter((object, index) => index === this.dataSourceException.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.dataSourceException.data = [];
        this.filterExceptionValues.forEach(element => {
          this.dataSourceException.data = this.dataSourceException.data.concat(this.filterExceptionChange(element));
        });
        //delete doublon
        this.dataSourceException.data = this.dataSourceException.data.filter((object, index) => index === this.dataSourceException.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterExceptionValues.length == 1) {
        this.dataSourceException.data = this.copySelectionException;
        this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterExceptionValues = this.filterExceptionValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterExceptionValues.forEach(element => {
          this.dataSourceException.data = this.filterExceptionChange(element)
        });
      }
    }

  }

  setFilteredItemsMetaDataOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterMetaDataValues.some(f => f.columnProp === filter.columnProp);
    if (filterExists == false) { this.filterMetaDataValues.push(filter) }
    // if only one select is selected
    if (this.filterMetaDataValues.length == 1) {
      this.dataSourceMetaData.data = this.filterMetaDataChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceMetaData.data = [...this.dataSourceMetaData.data, ...this.filterMetaDataChange(filter)];
        //delete doublon
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.filter((object, index) => index === this.dataSourceMetaData.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.dataSourceMetaData.data = [];
        this.filterMetaDataValues.forEach(element => {
          this.dataSourceMetaData.data = this.dataSourceMetaData.data.concat(this.filterMetaDataChange(element));
        });
        //delete doublon
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.filter((object, index) => index === this.dataSourceMetaData.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterMetaDataValues.length == 1) {
        this.dataSourceMetaData.data = this.copySelectionMetaData;
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterMetaDataValues = this.filterMetaDataValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterMetaDataValues.forEach(element => {
          this.dataSourceMetaData.data = this.filterMetaDataChange(element)
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
      this.dataSourceMAD.data = this.filterMadChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceMAD.data = [...this.dataSourceMAD.data, ...this.filterMadChange(filter)];
        //delete doublon
        this.dataSourceMAD.data = this.dataSourceMAD.data.filter((object, index) => index === this.dataSourceMAD.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.dataSourceMAD.data = [];
        this.filterMadValues.forEach(element => {
          this.dataSourceMAD.data = this.dataSourceMAD.data.concat(this.filterMadChange(element));
        });
        //delete doublon
        this.dataSourceMAD.data = this.dataSourceMAD.data.filter((object, index) => index === this.dataSourceMAD.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "") {
      if (this.filterMadValues.length == 1) {
        this.dataSourceMAD.data = this.copySelectionMad;
        this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      }
      else {
        this.filterMadValues = this.filterMadValues.filter(function (item) {
          return item.columnProp !== filter.columnProp;
        })
        this.filterMadValues.forEach(element => {
          this.dataSourceMAD.data = this.filterMadChange(element)
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

  filterMetaDataChange(filter) {
    this.fileSelected = "metadata";
    this.initSelectedCells();     // init selected cells
    this.copySelectionMetaData = this.copySelectionMetaData.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
    return this.copySelectionMetaData.filter(function (item) {
      return item[filter.columnProp] == String(filter.modelValue);
    });
  }

  indexOfInArray(item: string, array: string[]): number {
    let index: number = -1;
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) { index = i; }
    }
    return index;
  }
  /**
 * @param rowId
 * @param colId
 * @param cellsType
 */
  onMouseDown(rowId: number, colId: number, cellsType: string, file) {
    if (this.clickCorrection == false) {
      if (file == "livraison") {
        rowId = rowId + (this.paginator.toArray()[0].pageIndex * this.paginator.toArray()[0].pageSize)
      }
      else if (file == "exception") {
        rowId = rowId + (this.paginator.toArray()[1].pageIndex * this.paginator.toArray()[1].pageSize)
      }
      else if (file == "metadata") {
        rowId = rowId + (this.paginator.toArray()[2].pageIndex * this.paginator.toArray()[2].pageSize)
      }
      else {
        rowId = rowId + (this.paginator.toArray()[3].pageIndex * this.paginator.toArray()[3].pageSize)
      }
      this.tableMouseDown = { rowId: rowId, colId: colId, cellsType: cellsType };
    }
    else {  //disable click after click correction
      return false;
    }

  }

  onMouseUp(rowId: number, colId: number, cellsType: string, file) {
    this.fileSelected = file;  // update the file selected
    if (this.clickCorrection == false) {
      if (file == "livraison") {
        rowId = rowId + (this.paginator.toArray()[0].pageIndex * this.paginator.toArray()[0].pageSize)
      }
      else if (file == "exception") {
        rowId = rowId + (this.paginator.toArray()[1].pageIndex * this.paginator.toArray()[1].pageSize)
      }
      else if (file == "metadata") {
        rowId = rowId + (this.paginator.toArray()[2].pageIndex * this.paginator.toArray()[2].pageSize)
      }
      else {
        rowId = rowId + (this.paginator.toArray()[3].pageIndex * this.paginator.toArray()[3].pageSize)
      }


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
          dataCopy = this.dataSource.data.slice();// copy and mutate
        }
        else if (this.fileSelected == "exception") {
          dataCopy = this.dataSourceException.data.slice();// copy and mutate
        }
        else if (this.fileSelected == "metadata") {
          dataCopy = this.dataSourceMetaData.data.slice();// copy and mutate
        }
        else {
          dataCopy = this.dataSourceMAD.data.slice();// copy and mutate
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
              dataCopy[i][this.displayedColumnsMad[startCol]] = text;
            }
          }
        } else {
          //--Edit cells starting and ending not on the same column
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

        if (this.fileSelected == "livraison") {
          this.dataSource.data = dataCopy;
        }
        else if (this.fileSelected == "exception") {
          this.dataSourceException.data = dataCopy;
        }
        else if (this.fileSelected == "metadata") {
          this.dataSourceMetaData.data = dataCopy;
        }
        else {
          this.dataSourceMAD.data = dataCopy;
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
* Correct the file
*/
  correctionFile(index) {
    this.hideUiSelectionOnCorrection();  //hide ui selection on correction
    if (index == "livraison") {  // correction file livraison
      this.LAST_EDITABLE_ROW = this.dataSource.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsLivraison.length - 1;
      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsState[i][j] = false;

        }
      }
      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: Object.keys(this.dataSource.data[0]),
          rows: this.dataSource.data.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctLivraisonFile(this.fileTocheck).subscribe(res => {
        //console.log('resultat correction exception', res);
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    else if (index == "exception") {  // correction file exception
      this.LAST_EDITABLE_ROW = this.dataSourceException.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsException.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateException[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: Object.keys(this.dataSourceException.data[0]),
          rows: this.dataSourceException.data.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctExceptionFile(this.fileTocheck).subscribe(res => {
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    else if (index == "metadata") {  // correction file metadata
      this.LAST_EDITABLE_ROW = this.dataSourceMetaData.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMetadata.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMetaData[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: Object.keys(this.dataSourceMetaData.data[0]),
          rows: this.dataSourceMetaData.data.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctMetaDataFile(this.fileTocheck).subscribe(res => {
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
    else {  // correction file mad
      this.LAST_EDITABLE_ROW = this.dataSourceMAD.data.length - 1;
      this.LAST_EDITABLE_COL = this.displayedColumnsMad.length - 1;

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMad[i][j] = false;

        }
      }

      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacement: {
          columns: Object.keys(this.dataSourceMAD.data[0]),
          rows: this.dataSourceMAD.data.map(Object.values),
        }
      }
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
      this.service.correctMadFile(this.fileTocheck).subscribe(res => {
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        }
      })
    }
  }

  /**
 * Correct all transaction files
 */
  correctionAllFile() {
    this.fileTocheck = {
      transaction_id: this.transaction.transaction_id,
      fileReplacementLivraison: {
        columns: Object.keys(this.dataSource.data[0]),
        rows: this.dataSource.data.map(Object.values),
      },
      fileReplacementMAD: {
        columns: Object.keys(this.dataSourceMAD.data[0]),
        rows: this.dataSourceMAD.data.map(Object.values),
      },
      fileReplacementMetadata: {
        columns: Object.keys(this.dataSourceMetaData.data[0]),
        rows: this.dataSourceMetaData.data.map(Object.values),
      },
      fileReplacementException: {
        columns: Object.keys(this.dataSourceException.data[0]),
        rows: this.dataSourceException.data.map(Object.values),
      },

    }
    console.warn('file to check', this.fileTocheck)
    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);
    this.service.correctAllFiles(this.fileTocheck).subscribe(res => {
      if (res.message == "ok") {
        this.router.navigate(['/list-transaction']);
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
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}


