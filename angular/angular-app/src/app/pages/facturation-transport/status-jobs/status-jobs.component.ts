import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CallJobComponent } from '../dialog-call-job/call-job.component';
import { DialogSelectTransactionComponent } from '../dialog-select-transaction/dialog-select-transaction.component';
import { FacturationTransportService } from '../facturation-transport.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-status-jobs',
  templateUrl: './status-jobs.component.html',
  styleUrls: ['./status-jobs.component.scss']
})
export class StatusJobsComponent implements OnInit {
  public advancedHeaders = ['Plan', 'Dernière exécution', 'Statut', 'Actions', ' '];
  public advancedTable = [];
  public showLowder = true;
  constructor(private router: Router,
    private service: FacturationTransportService,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar
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
      //enable executing of a step if any other is on progress
      if(job.status != "Terminée"){
        this.advancedTable.map(element => element != job ? element.canBeExecuted = false : element.canBeExecuted = true);
      }
      //enable executing step 4 and 5 if step3 was not executed today
      if(job.plan == "step 3" && (job.derniere_execution).toString().substring(0,10) != this.datePipe.transform(new Date(), 'yyyy-MM-dd')){
        this.advancedTable.map(element => element != job ? element.canBeExecuted = false : null);
      }
    })
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
    if (planData.plan == 'step 4') {
      this.openCallJobDialog(planData.plan);

    }else if(planData.plan == "step 3"){
      this.openSelectTransactionDialog(planData.plan);
    }
     else {
      var data = {
        plan: planData.plan,
      }
      planData.status = "En attente";
      this.service.launchPlan(data).subscribe(res => {
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

  openSelectTransactionDialog(namePlan) {
    let dialogRef = this.matDialog.open(DialogSelectTransactionComponent, {
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
  verify(row) {
    if (row.plan.includes('4')) {
      // this.goToBilling();
      this.verifyStep4(row);
    } else if(row.plan.includes('3')){
      this.verifyStep3(row);
    }else {
      this.router.navigate([`/facturation-transport/factureSF`]);
    }
  }

  verifyStep3(row){
    this.openSnackBar("Vérification du fichier en cours...","Ok",4000)
    this.service.checkFileMAD().subscribe(res =>{
      if(res == "file found"){
        this.openSnackBar("Fichier vérifié avec succès.","Ok",10000);
        row.verified = "validate";
      }else{
        this.openSnackBar("Fichier introuvable, re-exécuter le step 3!","Ok",10000);
        row.verified = "not validate";
        this.advancedTable.forEach(job => {
          if(job.plan != row.plan){
            job.canBeExecuted = false ;
          }
        })    
      }
    },
    err=> {
      console.error(err);
      this.openSnackBar("Une erreur s'est produite!","Ok",10000)
    })

  }

  verifyStep4(row){
    const file = "billing"+this.advancedTable[0].derniere_execution.substring(0,10)+".xlsx";
    var data= {
      "file": file
    }
    console.log(file);
    this.service.checkFacturationstatusForFile(data).subscribe(
      res => {
        if (res.status == "Valide"){
          row.verified = "validate";
        }else{
          row.verified = "not validate";
        }
      },
      err => {
        row.verified = "not validate";
      }
    )
  }

  downloadFileBilling(derniere_execution){
    derniere_execution = derniere_execution.substring(0,10);
    console.log(derniere_execution);
    var data = {
      'date':derniere_execution
    }
    this.openSnackBar("Téléchargement du fichier en cours...","Ok",4000)

    this.service.downloadBillingZIP(data).subscribe(res => {
      saveAs(res, derniere_execution);
      this.openSnackBar("Téléchargement terminé avec succès.","Ok",4000)

    })

    
  }

  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      // verticalPosition: 'bottom',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

}
