import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CallJobComponent } from '../dialog-call-job/call-job.component';
import { FacturationTransportService } from '../facturation-transport.service';

@Component({
  selector: 'app-status-jobs',
  templateUrl: './status-jobs.component.html',
  styleUrls: ['./status-jobs.component.scss']
})
export class StatusJobsComponent implements OnInit {
  public advancedHeaders = ['Plan', 'Dernière exécution', 'Statut', 'Actions'];
  public advancedTable = [];
  public showLowder = true;
  constructor(private router: Router,
    private service: FacturationTransportService,
    private matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listenToWebSocket();
    this.getPlans();
  }

  getPlans(){
    this.service.getAllFacturationPlans().subscribe(res => {
      this.advancedTable = res;
      this.showLowder = false;
      this.checkWhichJobCanBeExecuted();
    },
      err => {
        this.showLowder = false;
      })
  }

  checkWhichJobCanBeExecuted(){
    this.advancedTable.forEach(job =>       job.canBeExecuted = true     )
    this.advancedTable.forEach(job => {
      if(job.status != "Terminée"){
        this.advancedTable.map(element => element != job ? element.canBeExecuted = false : element.canBeExecuted = true);
      }
    })
    console.log(this.advancedTable);
  }
  listenToWebSocket() {
    this.service.messages.subscribe(msg => {
      console.log("Response from websocket: ", JSON.parse(msg));
      if(JSON.parse(msg).statePlans === "table plansFacturation updated")
      {
        this.actualiser();
      }
    });
  }

  actualiser(){
    this.getPlans();
  }

  executeJob(planData) {
    planData.status = "En attente"
    if (planData.plan == 'step 4') {
      this.openCallJobDialog(planData.plan);

    } else {
      var data = {
        plan: planData.plan,
      }
      this.service.launchPlan(data).subscribe(res => {
        console.log(res);
        this.actualiser();
      },
        err => {

        })
    }
  }

  openCallJobDialog(namePlan) {
    let dialogRef = this.matDialog.open(CallJobComponent, {
      data: { plan: namePlan },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });


  }

  backToPreviousPage() {
    this.router.navigate([`/list-transaction`]);
  }
  goToBilling() {
    this.router.navigate([`/facturation-transport/billing`]);
  }
  goTo(path) {
    if (path.includes('4')) {
      this.goToBilling();
    } else {
      this.backToPreviousPage();
    }
  }
}
