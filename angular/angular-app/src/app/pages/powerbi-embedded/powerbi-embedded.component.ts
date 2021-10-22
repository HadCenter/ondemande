import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services';
import { interpolateObject } from 'd3';
import { PowerbiEmbeddedService } from './powerbi-embedded.service';

@Component({
  selector: 'app-powerbi-embedded',
  templateUrl: './powerbi-embedded.component.html',
  styleUrls: ['./powerbi-embedded.component.scss']
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
  public btnClicked = false;
  public getAdvancedTablePage(page, countPerPage) {
    return this.copyReportsPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }

  public advancedHeaders = this.pbiService.getAdvancedHeaders();
  public user: any;
  public capacityState: string;

  constructor(private router: Router,
    private pbiService: PowerbiEmbeddedService,
    private authService: AuthService) { }

  ngOnInit() {
    this.pbiService.getCapacityState().subscribe(res => this.capacityState = res);
    this.getReports();
    this.authService.userData.subscribe(user => this.user = user);
  }

  public suspendreCapacite() {
    let interval;
    this.btnClicked = true;
    this.pbiService.suspendCapacity().subscribe(res => console.log(res));
    this.pbiService.getCapacityState().subscribe(res => this.capacityState = res);
    interval = setInterval(() => {this.pbiService.getCapacityState().subscribe(res => {
      console.log(res);
      this.capacityState = res;
      if(this.capacityState == 'Paused'){
        clearInterval(interval);
        this.btnClicked = false;
        console.log("interval clearerd");
      }});
      }      ,5000)

  }
  public activerCapacite() {
    let interval;
    this.btnClicked = true;
    this.pbiService.resumeCapacity().subscribe(res => console.log(res));
    this.pbiService.getCapacityState().subscribe(res => this.capacityState = res);
    interval = setInterval(() => {this.pbiService.getCapacityState().subscribe(res => {
      console.log(res);
      this.capacityState = res;
      if(this.capacityState == 'Succeeded'){
        clearInterval(interval);
        this.btnClicked = false;
        console.log("interval clearerd");
      }});
      }
      ,15000);
      
    // while (this.capacityState != 'Succeeded') {
    //   console.log("WHILE LOOOOOP ", this.capacityState);
    //   this.pbiService.getCapacityState().subscribe(res => {
    //     this.capacityState = res;
    //     this.btnClicked = false;
    //   })
    //   setInterval(() => console.log("interval invoked"),10000)
    // }
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
