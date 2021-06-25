import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MagistorService } from './magistor.service';

@Component({
  selector: 'app-magistor',
  templateUrl: './magistor.component.html',
  styleUrls: ['./magistor.component.scss']
})
export class MagistorComponent implements OnInit {

  fichiers: any = [];
  public filterValue: any;

  constructor(private tablesService: MagistorService,
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
    this.fichiers = this.tablesService.advanceTableData;
    this.advancedTable = this.fichiers
  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.fichiers.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.advancedTable = this.sortByAttributeObject(this.fichiers, order, index);
  }
  public sortByAttributeObject(fichiers, order, index) {
    if (index == 0) {
      return this.sortByFichierOrder(fichiers, order, index);
    }
    else if (index == 1) {
      return this.sortByDateOrder(fichiers, order, index);
    }
    else if (index == 2) {
      return this.sortByClientOrder(fichiers, order, index);
    }
  }
  private sortByClientOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.nom_client > b.nom_client) {
        return 1 * order;
      }
      if (a.nom_client < b.nom_client) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }
  private sortByFichierOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.fichier > b.fichier) {
        return 1 * order;
      }
      if (a.fichier < b.fichier) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByDateOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.date_creation.slice(0, 10) > b.date_creation.slice(0, 10)) {
        return 1 * order;
      }
      if (a.date_creation.slice(0, 10) < b.date_creation.slice(0, 10)) {
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
    return this.fichiers.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

}
