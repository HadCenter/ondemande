import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'app/services';
import { interpolateObject } from 'd3';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
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
  canRefreshBD: boolean;
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
  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  public advancedHeaders = this.pbiService.getAdvancedHeaders();
  public user: any;
  public capacityState: string;

  constructor(private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private pbiService: PowerbiEmbeddedService,
    private authService: AuthService) { }

  ngOnInit() {
    this.getbtnRefreshDBState();
    this.getCapacityState(10000);
    this.getReports();
    this.authService.userData.subscribe(user => this.user = user);
    this.listenToWebSocket();

  }
  listenToWebSocket() {
    this.pbiService.messages.subscribe(msg => {
      console.log(JSON.parse(msg).statePowerbi);
      if (JSON.parse(msg).statePowerbi === "table powerbirtlog updated") {
        this.canRefreshBD = true;
      }
    });
  }
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  getbtnRefreshDBState(){
    this.pbiService.getRefreshDBState().subscribe(res => {
      console.log("########### ",res.status);
      if(res.status == "En cours"){
        this.canRefreshBD = false;
      }else{
        this.canRefreshBD = true;
      }

    })
  }



  public getCapacityState(duration: number) {
    let interval;
    this.pbiService.getCapacityState().subscribe(res => {
      this.capacityState = res;
      if (this.capacityState != "Succeeded" && this.capacityState != "Paused") {
        this.btnClicked = true;
        interval = setInterval(() => {
          this.pbiService.getCapacityState().subscribe(res => {
            console.log(res);
            this.capacityState = res;
            if (this.capacityState == 'Paused') {
              clearInterval(interval);
              this.btnClicked = false;
              this.openSnackBar("la capacité de Power BI a été mis en pause avec succès. ", "Ok", 7000);
              console.log("interval clearerd");
            } else if (this.capacityState == 'Succeeded') {
              clearInterval(interval);
              this.btnClicked = false;
              this.openSnackBar("la capacité de Power BI a démarré avec succès. ", "Ok", 7000);
              console.log("interval clearerd");
            }
          });
        }, duration);
      }
    });

  }
  public suspendreCapacite() {
    let interval;
    this.btnClicked = true;
    this.openSnackBar("Suspension de la capacité de Power BI en cours. ", "Ok", 5000);
    this.pbiService.suspendCapacity().subscribe(res => {
      //console.log(res)
      this.getCapacityState(5000);
    },
      err => {
        this.openSnackBar("Une erreur est survenue, veuillez réessayer. ", "Ok", 5000);
        this.btnClicked = false;
      });


  }
  public activerCapacite() {
    let interval;
    this.btnClicked = true;
    this.openSnackBar("Activation de la capacité de Power BI en cours. ", "Ok", 5000);
    this.pbiService.resumeCapacity().subscribe(res => {
      this.getCapacityState(15000);
    },
      err => {
        this.openSnackBar("Une erreur est survenue, veuillez réessayer. ", "Ok", 5000);
        this.btnClicked = false;
      }
    );
  }

  openConfirmDialog(decision) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      disableClose: false
    });
    if (decision == 'activer') {
      this.dialogRef.componentInstance.confirmMessage = "Voulez-vous activer la capacité ?"
    } else if (decision == 'suspendre') {
      this.dialogRef.componentInstance.confirmMessage = "Voulez-vous suspendre la capacité ?"
    }
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (decision == 'activer') {
          this.activerCapacite();
        } else if (decision == 'suspendre') {
          this.suspendreCapacite();
        }
      }
      this.dialogRef = null;
    });
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
    let wait;
    this.pbiService.getAllReports()
      .subscribe(res => {
        this.reports = res.value;
        this.reports.shift(); //supprime le rapprt : Report Usage Metrics Report qui crée 
        this.reports.forEach((element, index, array) => {
          this.pbiService.getDatasetState(element.datasetId).subscribe(res => {
            element.refreshDate = res.value[0].endTime;//retourne la derniere actualisation
            element.refreshState = res.value[0].status;
            console.log(element.refreshDate);
          });
        });
        console.log(this.reports);
        this.copyReportsPerPagination = this.reports;
        this.numPage = Math.ceil(res.value.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
        this.show = false;
      },
        error => console.log(error));
  }


  public showDetailReport(row) {
    console.log(row.id);
    this.router.navigate(['/details-rapport', row.id])
  }


  public refreshReport(row) {
    let interval, refreshState;
    this.openSnackBar("Actualisation du rapport en cours. ", "Ok", 5000);

    this.pbiService.refreshDataset(row.datasetId).subscribe(data => {
      row.refreshState = "Unknown";
      interval = setInterval(() => {
        this.pbiService.getDatasetState(row.datasetId).subscribe(res => {
          refreshState = res.value[0].status;
          row.refreshState = res.value[0].status;
          console.log(refreshState);
          if (refreshState == 'Completed') {
            clearInterval(interval);
            row.refreshDate = res.value[0].endTime;
            this.openSnackBar("Le rapport est actualisé avec succès. ", "Ok", 3600000);
          } else if (refreshState == 'Failed') {
            clearInterval(interval);
            row.refreshDate = res.value[0].endTime;
            this.openSnackBar("Erreur lors de l'actualisation du rapport,réessayer plus tard.", "Ok", 10000);
          }
        });
      }
        , 40000);
    },
      err => this.openSnackBar("Erreur lors de l'actualisation du rapport,réessayer plus tard.", "Ok", 5000));


  }

  public refreshBD() {
    var params = [{
      id_admin: this.user.id,
    }]
    this.pbiService.refreshBD(params).subscribe(
      res => this.openSnackBar("Actualisation de la base de données en cours... ", "Ok", 5000),
      err => this.openSnackBar("La base de données ne peut pas être actualisé manuellement, réessayer plus tard. ", "Ok", 5000),
    )

  }

}
