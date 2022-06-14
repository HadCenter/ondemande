import { Component, OnInit, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { ListTransactionService } from './list-transaction.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { GenererTransactionService } from './dialog/generer-transaction.service';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
  showLowderListTransaction = false;
  transactions: any = [];
  copyTransactionsPerPagination = [];
  public filterValue: any;
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];

  copy_transactions:any=[];
  showJobRun = false;
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  constructor(private tablesService: ListTransactionService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.listenToWebSocket();
    this.getTransactions();
  }

  formatDates(){
    this.copy_transactions.forEach(element => {
      const creatAt = (element.created_at.substr(0, 19)).split('-');
      var thisDate = creatAt[2].split('T');
      var time = thisDate[1].split(':');
      var currentTimeZoneOffsetInHours = ((new Date().getTimezoneOffset() / 60));
      time[0] = (parseInt(time[0]) - currentTimeZoneOffsetInHours).toString();  //affich l'heure selon l'heure de pc de l'user
      if(parseInt(time[0])>=24){
        time[0]=(parseInt(time[0])-24).toString();      
      }
      thisDate[1] = [time[0], time[1], time[2]].join(":");
      element.created_at = [thisDate[0], creatAt[1], creatAt[0]].join("-");
      element.created_at = [element.created_at, thisDate[1]].join(' à ')


      const start = (element.start_date.substr(0, 19)).split('-');
      var thisDate2 = start[2].split('T');
      element.start_date = [thisDate2[0], start[1], start[0]].join("-");

      const end = ((element.end_date.substr(0, 19)).split('-'));
      var thisDate3 = end[2].split('T');
      element.end_date = [thisDate3[0], end[1], end[0]].join("-");

      const modifAt = (element.modified_at.substr(0, 19)).split('-');
      var thisDate4 = modifAt[2].split('T');
      var time2 = thisDate4[1].split(':');

      time2[0] = (parseInt(time2[0]) - currentTimeZoneOffsetInHours).toString();  //affich l'heure selon l'heure de pc de l'user
      if(parseInt(time2[0])>=24){
      time2[0]=(parseInt(time2[0])-24).toString();      
      }
      thisDate4[1] = [time2[0], time2[1], time2[2]].join(":");
      element.modified_at = [thisDate4[0], modifAt[1], modifAt[0]].join("-");
      element.modified_at = [element.modified_at, thisDate4[1]].join(' à ')

      });
  }

  listenToWebSocket() {
    this.tablesService.messages.subscribe(msg => {
      console.log("Response from websocket: ", JSON.parse(msg));
      localStorage.setItem('wsTransaction', JSON.stringify(JSON.parse(msg)));
      console.log("COLMPARAIIIIISON    :   ",JSON.parse(msg).stateTransaction, "   = ",JSON.parse(msg).stateTransaction === "table transactionFile updated");
      if(JSON.parse(msg).stateTransaction === "table transactionFile updated")
      {
        this.actualiser();
      }
    });
  }
  getColor(ch) {
    if (ch === 'En attente') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch === 'En cours') {
      return 'orange';
    } else {
      return 'red';
    }
  }
  public gotoDetails(row) {
    this.router.navigate(['/details-transaction', row.transaction_id])
  }
  gotoFacturationTransport(){
    this.router.navigate(['/facturation-transport'])
  }

  public openDialog() {
    const dialogRef = this.dialog.open(DailogGenerateTransaction,{
      data: {
        copy_transactions : this.copy_transactions
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });
  }
  public actualiser() {
    this.advancedTable = [];
    this.transactions = [];
    this.copy_transactions = [];
    this.showLowderListTransaction = true;
    this.getTransactions();
  }
  public getTransactions() {
    this.showLowderListTransaction = true;
    this.tablesService.getAllTransactions()
      .subscribe(res => {
        this.showLowderListTransaction = false;
        this.transactions = res;
        this.copy_transactions=res;
        this.copyTransactionsPerPagination = this.transactions;
        console.log(this.transactions);
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
        this.formatDates();
      },
        error => {
          this.showLowderListTransaction = false;
          console.log(error)
        });
  }
  public integrerTransaction(transaction_id) {
    const formData = new FormData();
    formData.append('transaction_id', transaction_id);
    this.tablesService.integrerTransaction(formData).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/list-transaction']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  public getAdvancedTablePage(page, countPerPage) {
    return this.copyTransactionsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }
  /* available sort value:
-1 - desc; 	0 - no sorting; 1 - asc; null - disabled */
  public changeSorting(header, index) {
    const current = header.sort;
    if (current !== null) {
      this.advancedHeaders.forEach((cell) => {
        cell.sort = (cell.sort !== null) ? 0 : null;
      });
      header.sort = (current === 1) ? -1 : 1;
      this.changeAdvanceSorting(header.sort, index);
      this.changePage(1, true);
    }
  }
  public changeAdvanceSorting(order, index) {
    this.copyTransactionsPerPagination = this.sortByAttributeObject(this.copyTransactionsPerPagination, order, index);
  }
  public sortByAttributeObject(transactions, order, index) {
    if (index == 1) {
      return this.sortByTransactionOrder(transactions, order, index);
    }
    else if (index == 2) {
      return this.sortByDateDebutOrder(transactions, order, index);
    }
    else if (index == 3) {
      return this.sortByDateFinOrder(transactions, order, index);
    }
    else if (index ==0){
      return this.sortByDateCreation(transactions, order, index);
    }
  }

  private sortByDateCreation(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.created_at.slice(0, 19) > b.created_at.slice(0, 19)) {
        return 1 * order;
      }
      if (a.created_at.slice(0, 19) < b.created_at.slice(0, 19)) {
        return -1 * order;
      }
      return 0;
    }
    return array.sort(compareFunction);
  }
  private sortByTransactionOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.transaction_id > b.transaction_id) {
        return 1 * order;
      }
      if (a.transaction_id < b.transaction_id) {
        return -1 * order;
      }
      return 0;
    }
    return array.sort(compareFunction);
  }
  private sortByDateDebutOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.start_date.slice(0, 10) > b.start_date.slice(0, 10)) {
        return 1 * order;
      }
      if (a.start_date.slice(0, 10) < b.start_date.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }
  private sortByDateFinOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.end_date.slice(0, 10) > b.end_date.slice(0, 10)) {
        return 1 * order;
      }
      if (a.end_date.slice(0, 10) < b.end_date.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  setFilteredItems() {
    this.copyTransactionsPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyTransactionsPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyTransactionsPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyTransactionsPerPagination.slice(0, this.countPerPage);
  }
  filterItems(filterValue: string) {
  let _filterValue = !filterValue.includes('/') ? filterValue : filterValue.split('/').join('-');
  // this.transactions.forEach(element => {
  //   // element.created_at.toISOString().split('T')[0]
  //   const x=element.created_at.substr(0, 19) ;
  //   var allDate = x.split('-');
  //   var thisDate = allDate[2].split('T');
  //   element.created_at= [thisDate[0],allDate[1],allDate[0],thisDate[1] ].join("-");
  //  console.warn(element.created_at);
  //   //console.log((element.created_at.toISOString()).getFullYear() );
  // });
   //console.error(this.transactions)
     return this.copy_transactions.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(_filterValue.toLowerCase());
    });
  }
}

@Component({
  templateUrl: 'dialog/generer-transaction.component.html',
  styleUrls: ['dialog/generer-transaction.component.scss']
})
export class DailogGenerateTransaction {
  public snackAction = 'Ok';
  maxDate: Date;
  showloader = false;
  clicked = false;
  range = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });
  receivedTransactionsFromParentComponent: any = [];
  errorFound: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DailogGenerateTransaction>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service_genererTransaction: GenererTransactionService,
    private _snackBar: MatSnackBar,
  ) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() - 1);
    this.receivedTransactionsFromParentComponent = data
  }
  ngOnInit(): void {
  }
  onNoclick() {
    this.dialogRef.close();
  }
  genererTransaction() {
    this.errorFound = false;
    this.clicked = true;
    this.showloader = true;
    var start_date = this.toJSONLocal(this.range.value.start_date);
    var end_date = this.toJSONLocal(this.range.value.end_date);
    const formData = new FormData();
    formData.append('start_date', start_date);
    formData.append('end_date',end_date);
    // console.warn("start_date =",start_date);
    // console.warn("end_date =",end_date);
    const start = moment(start_date, 'YYYY-MM-DD');
    const end   = moment(end_date, 'YYYY-MM-DD');
    const rangeTransaction = moment.range(start, end);
    var rangeExist = false;
    var rangeEncours =false;
    this.receivedTransactionsFromParentComponent.copy_transactions.forEach(element => {
      if (element.statut == "En attente")
      {
         var formatStartDate = element.start_date.split("-").reverse().join("-");
         var formatEndDate = element.end_date.split("-").reverse().join("-");
         var rangeElement = moment.range(formatStartDate, formatEndDate);
         if (rangeElement.overlaps(rangeTransaction, { adjacent: true })){
           rangeExist = true;
         }
      }
      else if (element.statut == "En cours")
      {
         var formatStartDate = element.start_date.split("-").reverse().join("-");
         var formatEndDate = element.end_date.split("-").reverse().join("-");
         var rangeElement = moment.range(formatStartDate, formatEndDate);
         if (rangeElement.overlaps(rangeTransaction, { adjacent: true })){
           rangeEncours = true;
         }
      }
      
    });
    if (rangeExist)
    {
        this.openSnackBar("Une transaction est déjà en attente avec les dates sélectionnées", this.snackAction);
        this.showloader = false;
        this.dialogRef.close('submit');
    }
    else if (rangeEncours){
      this.openSnackBar("Une transaction est déjà en cours avec les dates sélectionnées", this.snackAction);
      this.showloader = false;
      this.dialogRef.close('submit');
    }
    else{
     this.service_genererTransaction.genererTransaction(formData).subscribe(
      (res) => {
        this.showloader = false;
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        this.clicked = false;
        this.errorFound = true;
      }
     );
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      // verticalPosition: 'bottom',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  // convertir les dates en une chaîne de date conviviale MySQL
  toJSONLocal(date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
  // public onInputChange(event) {
  //   event.target.required = true;
  // }
}

