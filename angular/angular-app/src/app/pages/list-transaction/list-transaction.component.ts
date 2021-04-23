import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListTransactionService } from './list-transaction.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {FormGroup, FormControl} from '@angular/forms';
import { GenererTransactionService } from './dialog/generer-transaction.service';
@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
  showLowderListTransaction = false;
  transactions: any = [];
  public filterValue: any;
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  constructor(private tablesService: ListTransactionService,
    private router: Router,
    public dialog: MatDialog) { }
  ngOnInit(): void {
     this.getTransactions();
  }
  public gotoDetails(row) {
    this.router.navigate(['/details-transaction', row.transaction_id])
  }

  public openDialog() {
    const dialogRef = this.dialog.open(DailogGenerateTransaction);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }

    });
  }
  public actualiser() {
    this.transactions = [];
    this.getTransactions();
  }
  public getTransactions() {
    this.showLowderListTransaction = true;
    this.tablesService.getAllTransactions()
      .subscribe(res => {
        this.showLowderListTransaction = false;
        this.transactions = res;
        console.log(this.transactions);
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
      },
        error => {
          this.showLowderListTransaction = false;
          console.log(error)
        });
  }
  public integrerTransaction(transaction_id)
  {
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
    return this.transactions.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.advancedTable = this.sortByAttributeObject(this.transactions, order, index);
  }
  public sortByAttributeObject(transactions, order, index) {
    if (index == 0) {
      return this.sortByTransactionOrder(transactions, order, index);
    }
    else if (index == 1) {
      return this.sortByDateDebutOrder(transactions, order, index);
    }
    else if (index == 2) {
      return this.sortByDateFinOrder(transactions, order, index);
    }
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
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
  }
  filterItems(filterValue) {
    return this.transactions.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }
}

@Component({
  templateUrl: 'dialog/generer-transaction.component.html',
  styleUrls: ['dialog/generer-transaction.component.scss']
})
export class DailogGenerateTransaction {
  showloader = false;
  clicked = false;
  range = new FormGroup({
    start_date: new FormControl(),
    end_date: new FormControl()
  });

  constructor(
    public dialogRef: MatDialogRef<DailogGenerateTransaction>,
    private service_genererTransaction : GenererTransactionService
  ) {

  }
  ngOnInit(): void {
  }
  onNoclick() {
    this.dialogRef.close();
  }
  genererTransaction()
  {
    this.clicked = true;
    this.showloader = true;
    var start_date = this.toJSONLocal(this.range.value.start_date);
    var end_date = this.toJSONLocal(this.range.value.end_date);
    const formData = new FormData();
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);
    this.service_genererTransaction.genererTransaction(formData).subscribe(
      (res) => {
        this.showloader = false;
        console.log(res);
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        console.log(err);
      }
    );

  }
  // convertir les dates en une chaîne de date conviviale MySQL
  toJSONLocal (date)
  {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
  // public onInputChange(event) {
  //   event.target.required = true;
  // }
}
