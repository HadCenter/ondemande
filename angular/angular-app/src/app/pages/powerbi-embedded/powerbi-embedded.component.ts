import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PowerbiEmbeddedService } from './powerbi-embedded.service';

@Component({
  selector: 'app-powerbi-embedded',
  templateUrl: './powerbi-embedded.component.html',
  styleUrls: ['./powerbi-embedded.component.css']
})
export class PowerbiEmbeddedComponent implements OnInit {
  reports = [];
  copyReportsPerPagination = [];
  show = true;
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public filterValue: any;
  limit = 15;
  public getAdvancedTablePage(page, countPerPage) {
    return this.copyReportsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }

  public advancedHeaders = this.pbiService.getAdvancedHeaders();

  constructor(private router: Router,
    private pbiService: PowerbiEmbeddedService) { }

  ngOnInit() {
    this.getReports();
  }
  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  setFilteredItems() {
    this.copyReportsPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyReportsPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyReportsPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyReportsPerPagination.slice(0, this.countPerPage);
  }
  filterItems(filterValue) {
    return this.reports.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getReports() {
    this.pbiService.getAllReports()
      .subscribe(res => {
        this.reports = res.value;
        console.log(this.reports);
        this.copyReportsPerPagination = this.reports;
        this.numPage = Math.ceil(res.value.length / this.countPerPage);
        this.show = false;
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
      },
        error => console.log(error));
  }

  public showDetailReport(row) {
    console.log(row.id);
    this.router.navigate(['/details-rapport', row.id])
  }
}
