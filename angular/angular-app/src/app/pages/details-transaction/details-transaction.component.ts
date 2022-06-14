import { Component, OnInit, HostListener, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectClientDialogComponent } from './select-client-dialog/select-client-dialog.component';


const moment = extendMoment(Moment);


export interface MouseEvent {
  rowId: number;
  colId: number;
  cellsType: string;
}
@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss'],
  providers: [DatePipe]
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit {
  copy_transactions: any = [];
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  fichierException: any = [];
  fichierLivraison: any = [];
  fichierMad: any = [];
  fichierMetadata: any = [];
  displayedColumnsLivraison: string[] = ['toDelete', 'Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name', 'isExpress', 'total_price','billingRoundName'];
  displayedColumnsException: string[] = ['isDeleted', 'Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom', 'Item___Type', 'Item___Quantite', 'Code_postal', 'Round_Name', 'Remarque', 'Express', 'billingRoundName'];
  displayedColumnsMetadata: string[] = ['Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name', 'sourceClosureDate', 'realInfoHasPrepared', 'status', 'metadataFACTURATION'];
  displayedColumnsMad: string[] = ['toDelete', 'Date', 'Expediteur', 'Activite', 'Categorie', 'Type_de_Service', 'ID_de_la_tache', 'Item___Nom_sous_categorie', 'Item___Type_unite_manutention', 'Item___Quantite', 'Code_postal', 'sourceHubName', 'Round_Name', 'StartTime', 'ClousureTime'];
  dataSource = new MatTableDataSource<any>(this.fichierLivraison);
  dataSourceException = new MatTableDataSource<any>(this.fichierException);
  dataSourceMetaData = new MatTableDataSource<any>(this.fichierMetadata);
  dataSourceMAD = new MatTableDataSource<any>(this.fichierMad);
  selection: any[] = [];
  selectionEception: any[] = [];
  selectionMetadata: any[] = [];
  selectionMad: any[] = [];
  newCellValue: string = '';
  // newCellValueException: string = '';
  // newCellValueMetadata: string = '';
  // newCellValueMad: string = '';
  arrayLivraison: any = [];
  arrayException: any = [];
  arrayMetaData: any = [];
  arrayMad: any = [];
  showLoader: boolean = false;
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
  rowsToDeleteException: any = [];
  rowsToDeleteLivraison: any = [];
  rowsToDeleteMad: any = [];
  clickCorrection: boolean = false;
  public filterValueLivraison: any;
  public filterValueException: any;
  public filterValueMad: any;
  public filterValuemetadata: any;
  copyDataSource: any = [];
  copyDataSourceException: any = [];
  copyDataSourceMetaData: any = [];
  copyDataSourceMad: any = [];

  columnsLivraison: any = [];
  rowsLivraison: any = [];
  columnsException: any = [];
  rowsException: any = [];
  columnsMetaData: any = [];
  rowsMetaData: any = [];
  columnsMad: any = [];
  rowsMad: any = [];
  copyDatatoSearch: any = [];
  copyDataExceptiontoSearch: any = [];
  copyDataMetaDatatoSearch: any = [];
  copyDataMADtoSearch: any = [];
  allLivraison: boolean = false;
  allException: boolean = false;
  dialogRef: MatDialogRef<SelectClientDialogComponent>;
  copyDatatoFilter: any[];
  copyDataExceptiontoFilter: any[];
  copyDataMetaDatatoFilter: any[];
  copyDataMADtoFilter: any[];



  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
    private _snackBar: MatSnackBar, private router: Router,
    private datePipe: DatePipe,
    public dialog: MatDialog,
  ) { super(); }

  ngOnInit(): void {
    this.service.getDetailTransaction(this.route.snapshot.params.id).subscribe(res => {
      this.transaction = res;
    })
    var data = { "transaction_id": parseInt(this.route.snapshot.params.id) };
    this.service.seeAllFileTransaction(data).subscribe(res => {

      if (res.livraison !== null && Object.keys(res.livraison).length !== 0) {
        this.dataSource.paginator = this.paginator.toArray()[0];

        this.arrayLivraison = res.livraison;
        this.dataSource.data = this.arrayLivraison.fileContent;
        this.dataSource.data = this.dataSource.data.sort((a, b) => (a.taskId < b.taskId) ? 1 : -1);
        this.copySelectionLivraison = this.dataSource.data  //copy to use on selection
        this.copyFilterLivraison = this.dataSource.data;
        this.copyDatatoSearch = this.dataSource.data;
        this.copyDatatoFilter = this.dataSource.data;
        this.copyDataSource = this.dataSource.data; // copy to correction
        this.dataSource.data.forEach(element => {
          this.selectedCellsState.push(Array.from({ length: Object.keys(this.dataSource.data[0]).length - 1 }, () => false))
        });
        // get select options
        this.displayedColumnsLivraison.forEach(item => {
          this.getOption(item);
        })
        if (this.dialogRef && this.dialogRef.componentInstance) {
          this.updateDialogData();
        }
      }
      this.showLoaderLivraisonFile = false;

      if (res.exception !== null && Object.keys(res.exception).length !== 0) {
        this.dataSourceException.paginator = this.paginator.toArray()[1];
        this.arrayException = res.exception;
        this.dataSourceException.data = this.arrayException.fileContent;
        this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.taskId < b.taskId) ? 1 : -1);
        this.copySelectionException = this.dataSourceException.data  //copy to use on selection
        this.copyFilterException = this.dataSourceException.data;
        this.copyDataExceptiontoSearch = this.dataSourceException.data;
        this.copyDataExceptiontoFilter = this.dataSourceException.data;
        this.copyDataSourceException = this.dataSourceException.data; // copy to correction
        this.dataSourceException.data.forEach(element => {
          this.selectedCellsStateException.push(Array.from({ length: Object.keys(this.dataSourceException.data[0]).length - 1 }, () => false))
        });
        // get select options
        this.displayedColumnsException.forEach(item => {
          this.getOptionException(item);
        })
      }
      this.showLoaderExceptionFile = false;

      if (res.metadata !== null && Object.keys(res.metadata).length !== 0) {
        this.dataSourceMetaData.paginator = this.paginator.toArray()[2];
        this.arrayMetaData = res.metadata;
        this.dataSourceMetaData.data = this.arrayMetaData.fileContent;
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.taskId < b.taskId) ? 1 : -1);
        this.copySelectionMetaData = this.dataSourceMetaData.data  //copy to use on selection
        this.copyFilterMetaData = this.dataSourceMetaData.data;
        this.copyDataMetaDatatoSearch = this.dataSourceMetaData.data;
        this.copyDataMetaDatatoFilter = this.dataSourceMetaData.data;
        this.copyDataSourceMetaData = this.dataSourceMetaData.data; // copy to correction
        this.dataSourceMetaData.data.forEach(element => {
          this.selectedCellsStateMetaData.push(Array.from({ length: Object.keys(this.dataSourceMetaData.data[0]).length - 1 }, () => false))
        });

        // get select options
        this.displayedColumnsMetadata.forEach(item => {
          this.getOptionMetaData(item);
        })
      }
      this.showLoaderMetadataFile = false;

      if (res.mad !== null && Object.keys(res.mad).length !== 0) {
        this.dataSourceMAD.paginator = this.paginator.toArray()[3];
        this.arrayMad = res.mad;
        this.dataSourceMAD.data = this.arrayMad.fileContent;
        this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.taskId < b.taskId) ? 1 : -1);
        this.copySelectionMad = this.dataSourceMAD.data  //copy to use on selection
        this.copyFilterMad = this.dataSourceMAD.data;
        this.copyDataMADtoSearch = this.dataSourceMAD.data;
        this.copyDataMADtoFilter = this.dataSourceMAD.data;
        this.copyDataSourceMad = this.dataSourceMAD.data; // copy to correction
        this.dataSourceMAD.data.forEach(element => {
          this.selectedCellsStateMad.push(Array.from({ length: Object.keys(this.dataSourceMAD.data[0]).length - 1 }, () => false))
        });
        // get select options
        this.displayedColumnsMad.forEach(item => {
          this.getOptionMAD(item);
        })
      }

      this.showLoaderMadFile = false;
    })
    this.getTransactions();

  }
  public getTransactions() {
    this.service.getAllTransactions()
      .subscribe(res => {
        this.copy_transactions = res;
        this.formatDates();
      },
        error => {
          console.log(error)
        });
  }

  formatDates() {
    this.copy_transactions.forEach(element => {
      const creatAt = (element.created_at.substr(0, 19)).split('-');
      const start = (element.start_date.substr(0, 19)).split('-');
      const end = ((element.end_date.substr(0, 19)).split('-'));
      var thisDate = creatAt[2].split('T');
      var thisDate2 = start[2].split('T');
      var thisDate3 = end[2].split('T');
      element.end_date = [thisDate3[0], end[1], end[0]].join("-");
      element.start_date = [thisDate2[0], start[1], start[0]].join("-");
      element.created_at = [thisDate[0], creatAt[1], creatAt[0]].join("-");
      element.created_at = [element.created_at, thisDate[1]].join(' à ')
    });
  }


  selectDeleteRow(row, typeFile) {

    if (typeFile == "exception") {
      //uncheck delete rowId from rowstoDelete
      if (this.rowsToDeleteException.includes(row.taskId)) {
        this.rowsToDeleteException.splice(this.rowsToDeleteException.indexOf(row.taskId), 1);
      }
      //check add to rowTodelete
      else {
        this.rowsToDeleteException.push(row.taskId);

      }

      if (row.isDeleted == 0) {
        row.isDeleted = 1;
      }
      else if (row.isDeleted == 1) {
        row.isDeleted = 0;
      }
      //Select automatique of column in livraison file
      this.dataSource.data.forEach(el => {
        if (row.taskId == el.taskId) {
          if (row.isDeleted == 1) {
            el.toDelete = 1;
            this.rowsToDeleteLivraison.push(el.taskId);
          }
          else if (row.isDeleted == 0) {
            el.toDelete = 0;
            if (this.rowsToDeleteLivraison.includes(el.taskId)) {
              this.rowsToDeleteLivraison.splice(this.rowsToDeleteLivraison.indexOf(el.taskId), 1);
            }
          }
        }
      })

    }
    else if (typeFile == "livraison") {
      //uncheck delete rowId from rowstoDelete
      if (this.rowsToDeleteLivraison.includes(row.taskId)) {
        this.rowsToDeleteLivraison.splice(this.rowsToDeleteLivraison.indexOf(row.taskId), 1);
      }
      //check add to rowTodelete
      else {
        this.rowsToDeleteLivraison.push(row.taskId);

      }
      if (row.toDelete == 0) {
        row.toDelete = 1;
      }
      else if (row.toDelete == 1) {
        row.toDelete = 0;
      }


      //Select automatique of column in exception file
      this.dataSourceException.data.forEach(el => {
        if (row.taskId == el.taskId) {
          if (row.toDelete == 1) {
            el.isDeleted = 1;
            this.rowsToDeleteException.push(el.taskId);
          }
          else if (row.toDelete == 0) {
            el.isDeleted = 0;
            if (this.rowsToDeleteException.includes(el.taskId)) {
              this.rowsToDeleteException.splice(this.rowsToDeleteException.indexOf(el.taskId), 1);
            }
          }
        }
      })



    }
    else if (typeFile == "mad") {
      //uncheck delete rowId from rowstoDelete
      if (this.rowsToDeleteMad.includes(row.taskId)) {
        this.rowsToDeleteMad.splice(this.rowsToDeleteMad.indexOf(row.taskId), 1);
      }
      //check add to rowTodelete
      else {
        this.rowsToDeleteMad.push(row.taskId);

      }
      if (row.toDelete == 0) {
        row.toDelete = 1;
      }
      else if (row.toDelete == 1) {
        row.toDelete = 0;
      }
      // location.reload();
    }


  }
  /**
   * Delete row from file exception
   */
  deleteRowsException() {
    this.fileTocheck = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: Object.keys(this.dataSourceException.data[0]),
        rows: this.dataSourceException.data.map(Object.values),
      }
    }
    this.service.correctExceptionFile(this.fileTocheck).subscribe(res => {
      if (res.message == "ok") {
        console.warn("ok");
        location.reload();

      }
    })
  }

  /**
    * Delete row from file livraison
    */
  deleteRowsLivraison() {
    this.fileTocheck = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: Object.keys(this.dataSource.data[0]),
        rows: this.dataSource.data.map(Object.values),
      }
    }
    this.service.correctLivraisonFile(this.fileTocheck).subscribe(res => {
      if (res.message == "ok") {
        console.warn("ok");
        location.reload();
        // return false;
      }
    })
  }

  /**
  * Delete row from file livraison
  */
  deleteRowsMad() {
    this.fileTocheck = {
      transaction_id: this.transaction.transaction_id,
      fileReplacement: {
        columns: Object.keys(this.dataSourceMAD.data[0]),
        rows: this.dataSourceMAD.data.map(Object.values),
      }
    }
    this.service.correctMadFile(this.fileTocheck).subscribe(res => {
      if (res.message == "ok") {
        console.warn("ok");
        location.reload();
      }
    })
  }

  /**
  * Get options inside selects for MetaData
  * @param filter
  */
  getOptionMetaData(filter) {
    let optionsMetaData = [];

    optionsMetaData = this.dataSourceMetaData.data.map((item) => item[filter]);
    optionsMetaData = optionsMetaData.filter(function (value, index) {
      return optionsMetaData.indexOf(value) == index && value != "";
    });

    if (filter == "Date") {
      optionsMetaData = optionsMetaData.sort();
    }
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

    optionsMad = this.dataSourceMAD.data.map((item) => item[filter]);
    optionsMad = optionsMad.filter(function (value, index) {
      return optionsMad.indexOf(value) == index && value != "";
    });


    if (filter == "Date") {
      optionsMad = optionsMad.sort();
    }
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

  /*******Return if checkbox on livraison bloc is check or no ******/
  isRowLivraisonSelected(taskId) {

    return this.rowsToDeleteLivraison.includes(taskId);
  }
  /*******Return if checkbox on Exception bloc is check or no ******/
  isRowExceptionSelected(taskId) {
    return this.rowsToDeleteException.includes(taskId);
  }
  /************selection multiple of checkbox in livraison bloc *******/
  deleteMasterToggleLivraison(event) {
    // unselect
    // if (this.rowsToDeleteLivraison.length == this.dataSource.data.length) {
    if (event.checked == false) {
      this.allLivraison = false;
      this.rowsToDeleteLivraison = [];
      this.dataSourceException.data.forEach(el => {
        this.dataSource.data.forEach(element => {
          element.toDelete = 0;
          //UnSelect automatique of column in Exception bloc
          if (element.taskId == el.taskId) {
            el.isDeleted = 0;
            if (this.rowsToDeleteException.includes(el.taskId)) {
              this.rowsToDeleteException.splice(this.rowsToDeleteException.indexOf(el.taskId), 1);

            }
          }
          this.allException = false;
        });
      })

      //select
    } else {
      this.allLivraison = true;
      // this.rowsToDeleteLivraison = [];
      for (var element of this.dataSource.data) {
        element.toDelete = 1;
        this.rowsToDeleteLivraison.push(element.taskId);
        //Select automatique of column in Exception bloc
        this.copyFilterException.forEach(el => {
          if (element.taskId == el.taskId) {
            el.isDeleted = 1;
            if (!this.rowsToDeleteException.includes(el.taskId)) {
              this.rowsToDeleteException.push(el.taskId);
            }

          }
          if (this.rowsToDeleteException.length == this.dataSourceException.data.length) {
            this.allException = true;
          }

        })
      }

    }

  }
  /************selection multiple of checkbox in livraison bloc *******/
  deleteMasterToggleException(event) {
    // if (this.rowsToDeleteException.length == this.dataSourceException.data.length) {
    if (event.checked == false) {
      this.allException = false;
      this.rowsToDeleteException = [];
      this.dataSourceException.data.forEach(element => {
        this.dataSource.data.forEach(el => {
          element.isDeleted = 0;
          //UnSelect automatique of column in livraison bloc
          if (element.taskId == el.taskId) {
            el.toDelete = 0;
            if (this.rowsToDeleteLivraison.includes(el.taskId)) {
              this.rowsToDeleteLivraison.splice(this.rowsToDeleteLivraison.indexOf(el.taskId), 1);

            }
          }
          this.allLivraison = false;
        })
      });
    } else {
      this.allException = true;
      //  this.rowsToDeleteException = [];
      for (var element of this.dataSourceException.data) {
        element.isDeleted = 1;
        this.rowsToDeleteException.push(element.taskId);

        this.copyFilterLivraison.forEach(el => {
          if (element.taskId == el.taskId) {
            el.toDelete = 1;
            if (!this.rowsToDeleteLivraison.includes(el.taskId)) {
              this.rowsToDeleteLivraison.push(el.taskId);
            }
            if (this.rowsToDeleteLivraison.length == this.dataSource.data.length) {
              this.allLivraison = true;
            }
          }

        })
      }
    }
  }

  /**
* Reset filter
*/
  resetFiltre(file) {
    if (file == "livraison") {
      // test if search value is empty
      if (this.filterValueLivraison == undefined || this.filterValueLivraison == "") {
        this.dataSource.data = this.copySelectionLivraison;
      }
      else {
        this.dataSource.data = this.copyDatatoFilter
      }
      this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.onChangeOptions();
      //reset the selected filtre
      this.options.forEach(element => {
        this.filterValues.forEach(el => {
          if (element.columnProp == el.columnProp) {
            element.modelValue = '';
          }
        });
      });
      this.filterValues = [];
      // reset header colors
      const rows = document.getElementsByClassName('titre-column') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.color = 'white';
      }
      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsState[i][j] = false;
        }
      }

    }
    else if (file == "exception") {
      if (this.filterValueException == undefined || this.filterValueException == "") {
        this.dataSourceException.data = this.copySelectionException;
      }
      else {
        this.dataSourceException.data = this.copyDataExceptiontoFilter;
      }

      this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.onChangeOptionsException();
      //reset the selected filtre
      this.optionsException.forEach(element => {
        this.filterExceptionValues.forEach(el => {
          if (element.columnProp == el.columnProp) {
            element.modelValue = '';
          }
        });
      });

      this.filterExceptionValues = [];

      //reset colors
      const rows = document.getElementsByClassName('titre-column-exception') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.color = 'white';
      }

      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateException[i][j] = false;
        }

      }


    }
    else if (file == "metadata") {
      if (this.filterValuemetadata == undefined || this.filterValuemetadata == "") {
        this.dataSourceMetaData.data = this.copySelectionMetaData;
      }
      else {
        this.dataSourceMetaData.data = this.copyDataMetaDatatoFilter;
      }

      this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.onChangeOptionsMetaData();

      //reset the selected filtre
      this.optionsMetaData.forEach(element => {
        this.filterMetaDataValues.forEach(el => {
          if (element.columnProp == el.columnProp) {
            element.modelValue = '';
          }
        });
      });

      this.filterMetaDataValues = [];
      //reset colors
      const rows = document.getElementsByClassName('titre-column-metadata') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.color = 'white';
      }
      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMetaData[i][j] = false;
        }

      }

    }

    else { //MAD

      if (this.filterValueMad == undefined || this.filterValueMad == "") {
        this.dataSourceMAD.data = this.copySelectionMad;
      }
      else {
        this.dataSourceMAD.data = this.copyDataMADtoFilter;
      }
      this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      this.onChangeOptionsMad();


      //reset the selected filtre
      this.optionsMad.forEach(element => {
        this.filterMadValues.forEach(el => {
          if (element.columnProp == el.columnProp) {
            element.modelValue = '';
          }
        });
      });

      this.filterMadValues = [];
      //reset colors
      const rows = document.getElementsByClassName('titre-column-mad') as HTMLCollectionOf<HTMLElement>;
      for (let i = 0; i < rows.length; i++) {
        rows[i].style.color = 'white';
      }
      for (let i = this.FIRST_EDITABLE_ROW; i <= this.LAST_EDITABLE_ROW; i++) {
        for (let j = this.FIRST_EDITABLE_COL; j <= this.LAST_EDITABLE_COL; j++) {
          this.selectedCellsStateMad[i][j] = false;
        }
      }


    }

  }
  /**
  * Get options inside selects for Livraison
  * @param filter
  */
  getOption(filter) {
    let options = [];

    options = this.dataSource.data.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {
      return options.indexOf(value) == index && value != "";
    });

    if (filter == "Date") {
      options = options.sort();
    }
    this.displayedColumnsLivraison.forEach((item, key) => {

      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj);

      }

    })
  }



  getOptionException(filter) {
    let optionsException = [];

    optionsException = this.dataSourceException.data.map((item) => item[filter]);
    optionsException = optionsException.filter(function (value, index) {
      return optionsException.indexOf(value) == index && value != "";
    });

    if (filter == "Date") {
      optionsException = optionsException.sort();
    }
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

    if (this.filterValueLivraison == '') {// test if search input is empty
      this.copySelectionLivraison = this.copySelectionLivraison.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      return this.copySelectionLivraison.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }
    else {
      this.copyDatatoFilter = this.copyDatatoFilter.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      return this.copyDatatoFilter.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }

  }

  /**
* Get lignes when filter exception change
* @param filter
*/
  filterExceptionChange(filter) {
    this.fileSelected = "exception";
    this.initSelectedCells();     // init selected cells
    if (this.filterValueException == '') {// test if search input is empty
      this.copySelectionException = this.copySelectionException.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      return this.copySelectionException.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }
    else {
      this.copyDataExceptiontoFilter = this.copyDataExceptiontoFilter.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      return this.copyDataExceptiontoFilter.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }

  }

  filterMetaDataChange(filter) {
    this.fileSelected = "metadata";
    this.initSelectedCells();     // init selected cells
    if (this.filterValuemetadata == '') {// test if search input is empty
      this.copySelectionMetaData = this.copySelectionMetaData.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      return this.copySelectionMetaData.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }
    else {
      this.copyDataMetaDatatoFilter = this.copyDataMetaDatatoFilter.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      return this.copyDataMetaDatatoFilter.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }

  }

  /**
* Get lignes when filter mad change
* @param filter
*/
  filterMadChange(filter) {
    this.fileSelected = "mad";
    this.initSelectedCells();     // init selected cells


    if (this.filterValueMad == '') {// test if search input is empty
      this.copySelectionMad = this.copySelectionMad.sort((a, b) => (a.Expediteur > b.Expediteur) ? 1 : -1);
      return this.copySelectionMad.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }
    else {
      this.copyDataMADtoFilter = this.copyDataMADtoFilter.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      return this.copyDataMADtoFilter.filter(function (item) {
        return item[filter.columnProp] == String(filter.modelValue);
      });
    }

  }


  /**** Filter items */
  setFilteredItemsLivraison() {
    this.dataSource.data = this.filterItemsLivraison(this.filterValueLivraison);
    if (this.filterValueLivraison === '') {
      this.dataSource.data = this.dataSource.data;
    }
    // if (this.dataSource.data.length >= 1) {
    this.filterValues.forEach(element => {
      this.changeSelectedOptionColor(element);
    });
    //  }
    this.onChangeOptions();
    this.copyDatatoFilter = this.dataSource.data;
  }

  filterItemsLivraison(filterValueLivraison: string) {
    if (this.filterValues.length >= 1) {  // test if a filter is selected
      return this.copyDatatoSearch.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterValueLivraison.toLowerCase());
      });
    }
    else {
      return this.copyFilterLivraison.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterValueLivraison.toLowerCase());
      });
    }

  }


  /**** Filter items */
  setFilteredItemsException() {

    this.dataSourceException.data = this.filterItemsException(this.filterValueException);
    if (this.filterValueException === '') {
      this.dataSourceException.data = this.dataSourceException.data;
    }
    //  if (this.dataSourceException.data.length >= 1) {
    this.filterExceptionValues.forEach(element => {
      this.changeSelectedOptionExceptionColor(element);
    })
    //}
    this.onChangeOptionsException();
    this.copyDataExceptiontoFilter = this.dataSourceException.data;
  }

  filterItemsException(filterValueException: string) {
    if (this.filterExceptionValues.length >= 1) {  // test if a filter is selected
      return this.copyDataExceptiontoSearch.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterValueException.toLowerCase());
      });
    }
    else {
      return this.copyFilterException.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterValueException.toLowerCase());
      });
    }
  }

  /**** Filter items */
  setFilteredItemsMetadata() {

    this.dataSourceMetaData.data = this.filterItemsMetadata(this.filterValuemetadata);
    if (this.filterValuemetadata === '') {
      this.dataSourceMetaData.data = this.dataSourceMetaData.data;
    }
    // if (this.dataSourceMetaData.data.length >= 1) {
    this.filterMetaDataValues.forEach(element => {
      this.changeSelectedOptionMetaDataColor(element);
    })
    // }
    this.onChangeOptionsMetaData();
    this.copyDataMetaDatatoFilter = this.dataSourceMetaData.data;
  }

  filterItemsMetadata(filterItemsMetadata: string) {
    if (this.filterMetaDataValues.length >= 1) {  // test if a filter is selected
      return this.copyDataMetaDatatoSearch.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMetadata.toLowerCase());
      });
    }
    else {
      return this.copyFilterMetaData.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMetadata.toLowerCase());
      });
    }
  }
  /**** Filter items */
  setFilteredItemsMAD() {
    this.dataSourceMAD.data = this.filterItemsMAD(this.filterValueMad);
    if (this.filterValueMad === '') {
      this.dataSourceMAD.data = this.dataSourceMAD.data;
    }
    //  if (this.dataSourceMAD.data.length >= 1) {
    this.filterMadValues.forEach(element => {
      this.changeSelectedOptionMadColor(element);
    })
    //  }

    this.onChangeOptionsMad();
    this.copyDataMADtoFilter = this.dataSourceMAD.data;
  }

  filterItemsMAD(filterItemsMAD: string) {

    if (this.filterMadValues.length >= 1) {  // test if a filter is selected
      return this.copyDataMADtoSearch.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMAD.toLowerCase());
      });
    }
    else {
      return this.copyFilterMad.filter((item) => {
        return JSON.stringify(item).toLowerCase().includes(filterItemsMAD.toLowerCase());
      });
    }

  }



  onChangeOptions() {
    this.options = [];
    this.displayedColumnsLivraison.forEach(item => { this.getOption(item); })
  }

  onChangeOptionsException() {
    this.optionsException = [];
    this.displayedColumnsException.forEach(item => { this.getOptionException(item); })
  }

  onChangeOptionsMetaData() {
    this.optionsMetaData = [];
    this.displayedColumnsMetadata.forEach(item => { this.getOptionMetaData(item); })
  }

  onChangeOptionsMad() {
    this.optionsMad = [];
    this.displayedColumnsMad.forEach(item => { this.getOptionMAD(item); })
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
  getIntersection(filter) {
    return this.dataSource.data.filter(function (item) {
      return filter.modelValue == item[filter.columnProp]
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }
  getIntersectionException(filter) {
    return this.dataSourceException.data.filter(function (item) {
      return filter.modelValue == item[filter.columnProp]
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  getIntersectionMetaData(filter) {
    return this.dataSourceMetaData.data.filter(function (item) {
      return filter.modelValue == item[filter.columnProp];
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }
  getIntersectionMad(filter) {
    return this.dataSourceMAD.data.filter(function (item) {
      return filter.modelValue == item[filter.columnProp];
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  /**
  * change color of the selected column header on file livraison
  */
  changeSelectedOptionColor(filter) {
    if (document.getElementById(filter.columnProp)) {
      if (filter.columnProp && filter.modelValue != "") {
        document.getElementById(filter.columnProp).style.color = "#00bcd4";
      }
      else {
        document.getElementById(filter.columnProp).style.color = "white";
      }
    }
  }
  /**
  * change color of the selected column header on file exception
  */
  changeSelectedOptionExceptionColor(filter) {
    if (document.getElementById(filter.columnProp + "Exception")) {
      if (filter.columnProp && filter.modelValue != "") {
        document.getElementById(filter.columnProp + "Exception").style.color = "#00bcd4";
      }
      else {
        document.getElementById(filter.columnProp + "Exception").style.color = "white";
      }
    }
  }
  /**
  * change color of the selected column header on file metaData
  */
  changeSelectedOptionMetaDataColor(filter) {
    if (document.getElementById(filter.columnProp + "MetaData")) {
      if (filter.columnProp && filter.modelValue != "") {
        document.getElementById(filter.columnProp + "MetaData").style.color = "#00bcd4";
      }
      else {
        document.getElementById(filter.columnProp + "MetaData").style.color = "white";
      }
    }
  }
  /**
  * change color of the selected column header on file MAD
  */
  changeSelectedOptionMadColor(filter) {
    if (document.getElementById(filter.columnProp + "Mad")) {
      if (filter.columnProp && filter.modelValue != "") {
        document.getElementById(filter.columnProp + "Mad").style.color = "#00bcd4";
      }
      else {
        document.getElementById(filter.columnProp + "Mad").style.color = "white";
      }
    }
  }
  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);

    if (this.filterValueLivraison !== "") { // test is search is empty
      this.dataSource.data = this.copyDatatoSearch;
    }

    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.dataSource.data = this.filterChange(filter);
      this.copyDatatoSearch = this.dataSource.data;
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {

        this.dataSource.data = this.getIntersection(filter);
        if (this.dataSource.data.length == 0) {
          this.dataSource.data.push({})
        }
      }
      else {

        this.dataSource.data = this.copyFilterLivraison;
        this.filterValues.forEach(element => {
          this.dataSource.data = this.dataSource.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.dataSource.data = this.dataSource.data.filter((object, index) => index === this.dataSource.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        if (this.dataSource.data.length == 0) {
          this.dataSource.data.push({})
        }
      }
      this.copyDatatoSearch = this.dataSource.data;
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);

      if (this.filterValues.length == 0) {

        if (this.filterValueLivraison == '') { // test if search is empty
          this.dataSource.data = this.copyDatatoSearch;
        }
        else {
          this.dataSource.data = this.copyDatatoFilter;
        }
        this.dataSource.data = this.dataSource.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else if (this.filterValues.length == 1) {
        this.dataSource.data = this.filterChange(this.filterValues[0])
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.dataSource.data = this.copySelectionLivraison;
        this.filterValues.forEach(element => {
          this.dataSource.data = this.dataSource.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        if (this.dataSource.data.length == 0) {
          this.dataSource.data.push({})
        }
      }
      this.copyDatatoSearch = this.dataSource.data;
    }
    //update selected all chebox
    if (this.rowsToDeleteLivraison.length == this.dataSource.data.length) {
      this.allLivraison = true;
      if (this.rowsToDeleteException.length == this.dataSourceException.data.length) {
        this.allException = true;
      }
    }
    else {
      this.allLivraison = false;
      if (this.rowsToDeleteException.length !== this.dataSourceException.data.length) {
        this.allException = false;
      }

    }
    this.onChangeOptions();
  }


  setFilteredItemsExceptionOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterExceptionValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionExceptionColor(filter);
    if (this.filterValueException !== "") { // test is search is empty
      this.dataSourceException.data = this.copyDataExceptiontoSearch;
    }
    if (filterExists == false) { this.filterExceptionValues.push(filter) }
    // if only one select is selected
    if (this.filterExceptionValues.length == 1) {
      this.dataSourceException.data = this.filterExceptionChange(filter);
      this.copyDataExceptiontoSearch = this.dataSourceException.data;
    }

    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceException.data = this.getIntersectionException(filter)
        if (this.dataSourceException.data.length == 0) {
          this.dataSourceException.data.push({})
        }
      }
      else {
        this.dataSourceException.data = this.copyFilterException;
        this.filterExceptionValues.forEach(element => {
          this.dataSourceException.data = this.dataSourceException.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.dataSourceException.data = this.dataSourceException.data.filter((object, index) => index === this.dataSourceException.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        if (this.dataSourceException.data.length == 0) {
          this.dataSourceException.data.push({})
        }
      }
      this.copyDataExceptiontoSearch = this.dataSourceException.data;
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterExceptionValues = this.filterExceptionValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterExceptionValues.length == 0) {
        if (this.filterValueException == "") { // test is search is empty
          this.dataSourceException.data = this.copyDataExceptiontoSearch;
        }
        else {
          this.dataSourceException.data = this.copyDataExceptiontoFilter;
        }

        this.dataSourceException.data = this.dataSourceException.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else if (this.filterExceptionValues.length == 1) {
        this.dataSourceException.data = this.filterChange(this.filterExceptionValues[0])
      }
      else {
        this.filterExceptionValues = this.filterExceptionValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.dataSourceException.data = this.copySelectionException;
        this.filterExceptionValues.forEach(element => {
          this.dataSourceException.data = this.dataSourceException.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        if (this.dataSourceException.data.length == 0) {
          this.dataSourceException.data.push({})
        }
      }
      this.copyDataExceptiontoSearch = this.dataSourceException.data;
    }
    // update select all checkbox
    if (this.rowsToDeleteException.length == this.dataSourceException.data.length) {
      this.allException = true;
      if (this.rowsToDeleteLivraison.length == this.dataSource.data.length) {
        this.allLivraison = true;
      }
    }
    else {
      this.allException = false;
      if (this.rowsToDeleteLivraison.length !== this.dataSource.data.length) {
        this.allLivraison = false;
      }

    }
    this.onChangeOptionsException();
  }

  setFilteredItemsMetaDataOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterMetaDataValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionMetaDataColor(filter);
    if (this.filterValuemetadata !== "") { // test is search is empty
      this.dataSourceMetaData.data = this.copyDataMetaDatatoSearch;
    }
    else {
      this.dataSourceMetaData.data = this.copySelectionMetaData;
    }
    if (filterExists == false) { this.filterMetaDataValues.push(filter) }
    // if only one select is selected
    if (this.filterMetaDataValues.length == 1) {
      this.dataSourceMetaData.data = this.filterMetaDataChange(filter);
      this.copyDataMetaDatatoSearch = this.dataSourceMetaData.data;
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceMetaData.data = this.getIntersectionMetaData(filter)
        if (this.dataSourceMetaData.data.length == 0) {
          this.dataSourceMetaData.data.push({})
        }
      }
      else {
        this.dataSourceMetaData.data = this.copyFilterMetaData;
        this.filterMetaDataValues.forEach(element => {
          this.dataSourceMetaData.data = this.dataSourceMetaData.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.dataSourceMetaData.data = this.dataSourceMetaData.data.filter((object, index) => index === this.dataSourceMetaData.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        if (this.dataSourceMetaData.data.length == 0) {
          this.dataSourceMetaData.data.push({})
        }
      }
      this.copyDataMetaDatatoSearch = this.dataSourceMetaData.data;
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {
      this.filterMetaDataValues = this.filterMetaDataValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterMetaDataValues.length == 0) {
        if (this.filterValuemetadata == "") { // test is search is empty
          this.dataSourceMetaData.data = this.copyDataMetaDatatoSearch;
        }
        else {
          this.dataSourceMetaData.data = this.copyDataMetaDatatoFilter;
        }

        this.dataSourceMetaData.data = this.dataSourceMetaData.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else if (this.filterMetaDataValues.length == 1) {
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
      this.copyDataMetaDatatoSearch = this.dataSourceMetaData.data;
    }
    this.onChangeOptionsMetaData();
  }

  setFilteredItemsMadOptions(filter) {

    // check if filter is already selected
    const filterExists = this.filterMadValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionMadColor(filter);
    if (this.filterValueMad !== "") { // test is search is empty
      this.dataSourceMAD.data = this.copyDataMADtoSearch;
    }
    if (filterExists == false) { this.filterMadValues.push(filter) }
    // if only one select is selected
    if (this.filterMadValues.length == 1) {
      this.dataSourceMAD.data = this.filterMadChange(filter);
      this.copyDataMADtoSearch = this.dataSourceMAD.data;
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.dataSourceMAD.data = this.getIntersectionMad(filter)
        if (this.dataSourceMAD.data.length == 0) {
          this.dataSourceMAD.data.push({})
        }
      }
      else {

        this.dataSourceMAD.data = this.copyFilterMad;
        this.filterMadValues.forEach(element => {
          this.dataSourceMAD.data = this.dataSourceMAD.data.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.dataSourceMAD.data = this.dataSourceMAD.data.filter((object, index) => index === this.dataSourceMAD.data.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
        if (this.dataSourceMAD.data.length == 0) {
          this.dataSourceMAD.data.push({})
        }
      }
      this.copyDataMADtoSearch = this.dataSourceMAD.data;
    }
    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {
      if (this.filterMadValues.length == 0) {
        if (this.filterValueMad == "") { // test is search is empty
          this.dataSourceMAD.data = this.copyDataMADtoSearch;
        }
        else {
          this.dataSourceMAD.data = this.copyDataMADtoFilter;
        }

        this.dataSourceMAD.data = this.dataSourceMAD.data.sort((a, b) => (a.Date < b.Date) ? 1 : -1);
      }
      else if (this.filterMadValues.length == 1) {
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
      this.copyDataMADtoSearch = this.dataSourceMAD.data;
    }
    this.onChangeOptionsMad();
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
              if (this.displayedColumnsLivraison[startCol] == "Round_Name") {
                dataCopy[i][this.displayedColumnsLivraison[15]] = text;
              }
              dataCopy.forEach(element => {
                if(element.Tournee == dataCopy[i]['Tournee'] ){
                  element.Round_Name = text;
                  element.billingRoundName = text;
                }
              });
              /**if we modify a column of the livraison file it will be automatically modified at the level of the exception file */
              this.dataSourceException.data.forEach(el => {
                if(el.Tournee == dataCopy[i]['Tournee'] && this.displayedColumnsLivraison[startCol] == "Round_Name" ){
                  el.Round_Name = text;
                  el.billingRoundName = text;
                }
                if (dataCopy[i].taskId == el.taskId) {
                  /*****processing of fields with different column names */
                  if (this.displayedColumnsLivraison[startCol] == "isExpress") {
                    if ((dataCopy[i][this.displayedColumnsLivraison[startCol]]) == 1) {
                      el.Express = "OUI";
                    }
                    else if ((dataCopy[i][this.displayedColumnsLivraison[startCol]]) == 0) {
                      el.Express = "NON";
                    }
                  }

                  else if (this.displayedColumnsLivraison[startCol] == "Item___Nom_sous_categorie") {
                    el.Item___Nom = text
                  }
                  else if (this.displayedColumnsLivraison[startCol] == "Item___Type_unite_manutention") {
                    el.Item___Type = text;
                  }
                  /******* */
                  else {
                    if (this.displayedColumnsException.indexOf(this.displayedColumnsLivraison[startCol]) > -1) {
                      el[this.displayedColumnsLivraison[startCol]] = text
                      //if change Round_Name then change billingRoundName
                      if (this.displayedColumnsLivraison[startCol] == "Round_Name") {
                        el[this.displayedColumnsLivraison[15]] = text;
                      }
                    }
                  }

                }
              })

            }
            else if (this.fileSelected == "exception") {
              dataCopy[i][this.displayedColumnsException[startCol]] = text;
              //if change Round_Name then change billingRoundName
              if (this.displayedColumnsException[startCol] == "Round_Name") {
                dataCopy[i][this.displayedColumnsException[14]] = text;
              }
              dataCopy.forEach(element => {
                if(element.Tournee == dataCopy[i]['Tournee']){
                  element.Round_Name = text;
                  element.billingRoundName = text;
                }
              });
              /**if we modify a column of the exception file it will be automatically modified at the level of the delivery file */
              this.dataSource.data.forEach(el => {
                if(el.Tournee == dataCopy[i]['Tournee'] && this.displayedColumnsLivraison[startCol] == "Round_Name" ){
                  el.Round_Name = text;
                  el.billingRoundName = text;
                }
                if (dataCopy[i].taskId == el.taskId) {
                  /*****processing of fields with different column names */
                  if (this.displayedColumnsException[startCol] == "Express") {
                    if ((dataCopy[i][this.displayedColumnsException[startCol]]).toUpperCase() == "OUI") {
                      el.isExpress = 1;
                    }
                    else if ((dataCopy[i][this.displayedColumnsException[startCol]]).toUpperCase() == "NON") {
                      el.isExpress = 0;
                    }
                  }

                  else if (this.displayedColumnsException[startCol] == "Item___Nom") {
                    el.Item___Nom_sous_categorie = text
                  }
                  else if (this.displayedColumnsException[startCol] == "Item___Type") {
                    el.Item___Type_unite_manutention = text;
                  }
                  /******* */
                  else {
                    if (this.displayedColumnsLivraison.indexOf(this.displayedColumnsException[startCol]) > -1) {
                      el[this.displayedColumnsException[startCol]] = text;
                      //if change Round_Name then change billingRoundName
                      if (this.displayedColumnsException[startCol] == "Round_Name") {
                        el[this.displayedColumnsException[14]] = text;
                      }                      
                    }
                  }

                }
              })
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
        this.openSnackBar('Les cellules sélectionnées n\'ont pas le même type.', 'Fermé', 5000);
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
    if (this.verifRangeDateBeforeCorrection()) {
      this.openSnackBar("Une transaction est déjà en attente avec les dates sélectionnées", this.snackAction, 6000);
    } else {
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
            rows: this.copyDataSource.map(Object.values),
          }
        }
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction, 4000);
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
            rows: this.copyDataSourceException.map(Object.values),
          }
        }
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction, 4000);
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
            rows: this.copyDataSourceMetaData.map(Object.values),
          }
        }
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction, 4000);
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
            rows: this.copyDataSourceMad.map(Object.values),
          }
        }
        this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction, 4000);
        this.service.correctMadFile(this.fileTocheck).subscribe(res => {
          if (res.message == "ok") {
            this.router.navigate(['/list-transaction']);
          }
        })
      }
    }
  }

  /**
  * Correct all transaction files
  */
  correctionAllFile() {
    if (this.verifRangeDateBeforeCorrection()) {
      this.openSnackBar("Une transaction est déjà en attente avec les dates sélectionnées", this.snackAction, 4000);
    } else {
      this.showLoader = true;
      if (this.dataSource.data.length > 0) {
        this.copyDataSource.map(element => element.Round_Name = element.billingRoundName);
        this.copyDataSource.map(element => delete element.billingRoundName);
        this.columnsLivraison = Object.keys(this.copyDataSource[0]);
        this.rowsLivraison = this.copyDataSource.map(Object.values);
      }
      if (this.dataSourceException.data.length > 0) {
        this.copyDataSourceException.map(element => element.Round_Name = element.billingRoundName);
        this.copyDataSourceException.map(element => delete element.billingRoundName);
        this.columnsException = Object.keys(this.copyDataSourceException[0]);
        this.rowsException = this.copyDataSourceException.map(Object.values);
        console.log(this.copyDataSourceException);
        
      }
      if (this.dataSourceMetaData.data.length > 0) {
        this.columnsMetaData = Object.keys(this.copyDataSourceMetaData[0]);
        this.rowsMetaData = this.copyDataSourceMetaData.map(Object.values);
      }
      if (this.dataSourceMAD.data.length > 0) {
        this.columnsMad = Object.keys(this.copyDataSourceMad[0]);
        this.rowsMad = this.copyDataSourceMad.map(Object.values);
      }
      this.fileTocheck = {
        transaction_id: this.transaction.transaction_id,
        fileReplacementLivraison: {
          columns: this.columnsLivraison,
          rows: this.rowsLivraison,
        },
        fileReplacementMAD: {
          columns: this.columnsMad,
          rows: this.rowsMad,
        },
        fileReplacementMetadata: {
          columns: this.columnsMetaData,
          rows: this.rowsMetaData,
        },
        fileReplacementException: {
          columns: this.columnsException,
          rows: this.rowsException,
        },

      }
      console.warn('file to check', this.fileTocheck)
      this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction, 4000);
      this.service.correctAllFiles(this.fileTocheck).subscribe(res => {
        if (res.message == "ok") {
          this.router.navigate(['/list-transaction']);
        } else {
          this.openSnackBar("Une erreur est survenue, veuillez réessayer", this.snackAction, 12000);
          this.router.navigate(['/list-transaction']);
        }
      },
        err => {
          this.openSnackBar("Une erreur est survenue, veuillez réessayer", this.snackAction, 12000);
          this.router.navigate(['/list-transaction']);
        }
      )
    }
  }
  verifRangeDateBeforeCorrection() {
    const startDate = (this.transaction.start_date.substr(0, 19)).split('-');
    const endDate = ((this.transaction.end_date.substr(0, 19)).split('-'));
    var thisDate2 = startDate[2].split('T');
    var thisDate3 = endDate[2].split('T');
    const end_date = [thisDate3[0], endDate[1], endDate[0]].join("-");
    const start_date = [thisDate2[0], startDate[1], startDate[0]].join("-");
    var formatStartDate = start_date.split("-").reverse().join("-");
    var formatEndDate = end_date.split("-").reverse().join("-");
    const start = moment(formatStartDate, 'YYYY-MM-DD');
    const end = moment(formatEndDate, 'YYYY-MM-DD');
    const rangeTransaction = moment.range(start, end);
    var rangeExist = false;
    this.copy_transactions.forEach(element => {
      if (element.statut == "En attente") {
        var formatStartDate = element.start_date.split("-").reverse().join("-");
        var formatEndDate = element.end_date.split("-").reverse().join("-");
        var rangeElement = moment.range(formatStartDate, formatEndDate);
        if (rangeElement.overlaps(rangeTransaction, { adjacent: true })) {
          rangeExist = true;
        }
      }
    });
    return rangeExist;
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
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  downloadFile(typeFile, clientList) {

    if (typeFile == "livraison") {
      var today_date = this.datePipe.transform(new Date(), 'dd_MM_YYYY');
      var fileName= today_date + "_fichierlivraison.xlsx";

      var fileToDownload = {
        transaction_id: this.route.snapshot.params.id,
        clientList: clientList
      }

      this.openSnackBar("Téléchargement du fichier en cours..", this.snackAction, 10000);

      this.service.importLivraisonFile(fileToDownload).subscribe(res => {
        //if response is a zip, download zip file else download xlsx
        if(res.type.toString().includes("zip")){
          saveAs(res, fileName.replace("xlsx","zip"));
        }else{
          saveAs(res, fileName);
        }
        this.openSnackBar("Le fichier est téléchargé avec succès.", this.snackAction, 4500);

      },
        error => this.openSnackBar("Une erreur s'est produite lors du chargement du fichier..", this.snackAction, 4500)
      );
    }
  }


  openSelectClientDialog(clients) {
    this.dialogRef = this.dialog.open(SelectClientDialogComponent, {
      width: '450px',
      panelClass: 'select-client-container',

      disableClose: false
    });
    this.dialogRef.componentInstance.liste_clients = [];
    this.updateDialogData();

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.downloadFile("livraison", this.dialogRef.componentInstance.selectedClients);
      }
      this.dialogRef = null;
    });
  }

  updateDialogData() {
    this.arrayLivraison.fileContent.forEach(element => {
      if (!this.dialogRef.componentInstance.liste_clients.includes(element.Expediteur)) {
        this.dialogRef.componentInstance.liste_clients.push(element.Expediteur);
      }
    });

  }
}

