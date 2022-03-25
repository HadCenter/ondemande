import { Component, OnInit } from '@angular/core';
import { ListFacturationPreparationService } from './list-facturation-preparation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-list-facturation-preparation',
  templateUrl: './list-facturation-preparation.component.html',
  styleUrls: ['./list-facturation-preparation.component.scss']
})
export class ListFacturationPreparationComponent implements OnInit {
  clients: any = [];
  clientsPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  show = true;
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };
  public advancedHeaders = this.service.getAdvancedHeaders();

  constructor(private service: ListFacturationPreparationService, private router: Router,) { }

  ngOnInit(): void {
    this.getClients();
  }

  public getClients() {
    this.service.getClients()
      .subscribe(res => {
        this.clients = res;
        this.clientsPerPagination = this.clients;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.show = false;
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */

      },
        error => console.log(error));
  }

  public getAdvancedTablePage(page, countPerPage) {
    return this.clientsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.clientsPerPagination = this.sortByAttributeObject(this.clientsPerPagination, order, index);
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  public sortByAttributeObject(clients, order, index) {
    if (index == 0) {
      return this.sortByNomClientnOrder(clients, order, index);
    }
    else if (index == 1) {
      return this.sortByCodeClientOrder(clients, order, index);
    }

  }

  private sortByNomClientnOrder(array, order, value) {
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

  private sortByCodeClientOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.code_client > b.code_client) {
        return 1 * order;
      }
      if (a.code_client < b.code_client) {
        return -1 * order;
      }
      return 0;
    }
    return array.sort(compareFunction);
  }

  gotoConfiguration(code_client) {
    this.router.navigate(['/configuration-critere', code_client])
  }
}
