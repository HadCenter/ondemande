import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListTransactionService } from './list-transaction.service';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
  transactions: any = [];
  public filterValue: any;

  constructor(private tablesService: ListTransactionService,
    private router: Router,) { }
  public advancedHeaders = this.tablesService.getAdvancedHeaders();
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 1;
  public advancedTable = [];

  ngOnInit(): void {
    this.transactions = this.tablesService.advanceTableData;
    this.advancedTable = this.transactions
  }
  gotoDetails(row) {
    this.router.navigate(['/details-transaction', row.transaction])
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
      return this.sortByDateOrder(transactions, order, index);
    }
    else if (index == 2) {
      return this.sortByDateOrder(transactions, order, index);
    }
  }
  private sortByTransactionOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.transaction > b.transaction) {
        return 1 * order;
      }
      if (a.transaction < b.transaction) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByDateOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.date_debut.slice(0, 10) > b.date_debut.slice(0, 10)) {
        return 1 * order;
      }
      if (a.date_debut.slice(0, 10) < b.date_debut.slice(0, 10)) {
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
