import { Component, OnInit } from '@angular/core';
import { FacturationTransportService } from '../facturation-transport.service';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-billing',
  templateUrl: './list-billing.component.html',
  styleUrls: ['./list-billing.component.scss']
})
export class ListBillingComponent implements OnInit {
  public currentPage = 1;
  public numPage = 1;
  public countPerPage = 8;
  public filterValue: any;
  showLowder = true;
  files = [];
  billing_list = [];
  copy_billing_list_pagination= [];

  constructor(private factTransportService: FacturationTransportService,
    private router: Router) { }
  public advancedHeaders = ['Billing','Statut','Actions'];
  ngOnInit(): void {
    this.factTransportService.getAllBillingss().subscribe(res => {
      this.files = res;
      this.copy_billing_list_pagination = this.files;
      this.numPage = Math.ceil(res.length / this.countPerPage);
      this.billing_list = this.getbilling_listPage(1, this.countPerPage);
      this.showLowder = false;
    },
      err => { console.error(err); })
  }

  downloadFile(file){
    var data = {
      'file':file
    }
    this.factTransportService.downloadBillingFile(data).subscribe(res => {
      saveAs(res, file);

    })
  }
  
  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.billing_list = this.getbilling_listPage(page, this.countPerPage);
    }
  }
  public getbilling_listPage(page, countPerPage) {
    return this.copy_billing_list_pagination.slice((page - 1) * countPerPage, page * countPerPage);
  }
  /**** Filter items */
  setFilteredItems() {
    this.copy_billing_list_pagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.billing_list = this.billing_list;
    }
    this.currentPage = this.copy_billing_list_pagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copy_billing_list_pagination.length / this.countPerPage);
    this.billing_list = this.copy_billing_list_pagination.slice(0, this.countPerPage);
  }

  filterItems(filterValue: string) {
    let _filterValue = !filterValue.includes('/') ? filterValue : filterValue.split('/').join('-');
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(_filterValue.toLowerCase());
    });
  }

  backToPreviousPage(){
    this.router.navigate([`/facturation-transport/`]);
  }
  
  gotoJobsPage(){
    this.router.navigate([`/facturation-transport/jobs`]);
  }

  verifyStatusForFile(file){
    var idx = this.billing_list.findIndex((obj => obj.name == file));
    this.billing_list[idx].status = "en cours";
    var data= {
      "file":file
    }
    this.factTransportService.checkFacturationstatusForFile(data).subscribe(
      res => {
        var idx = this.billing_list.findIndex((obj => obj.name == res.name));
        this.billing_list[idx].status = res.status;
      }
    )
  }
}
