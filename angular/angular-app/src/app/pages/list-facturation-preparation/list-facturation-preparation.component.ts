import { Component, OnInit } from '@angular/core';
import { ListFacturationPreparationService } from './list-facturation-preparation.service';
@Component({
  selector: 'app-list-facturation-preparation',
  templateUrl: './list-facturation-preparation.component.html',
  styleUrls: ['./list-facturation-preparation.component.scss']
})
export class ListFacturationPreparationComponent implements OnInit {
  clients: any =[];
  clientsPerPagination: any=[];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public advancedHeaders = this.service.getAdvancedHeaders();
  constructor(private service: ListFacturationPreparationService,) { }

  ngOnInit(): void {
    this.getClients();
  }
  public getClients() {
    this.service.getClients()
      .subscribe(res => {
        this.clients = res;
        this.clientsPerPagination = this.clients;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage); /****to display */
      
      },
        error => console.log(error));
  }
  public getAdvancedTablePage(page, countPerPage) {
    return this.clientsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }

}
