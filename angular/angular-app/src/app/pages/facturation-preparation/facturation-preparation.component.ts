import { DatePipe } from '@angular/common';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogDetailsFacturationComponent } from './dialog-details-facturation/dialog-details-facturation.component';
import { FacturationPreparationService } from './facturation-preparation.service';

@Component({
  selector: 'app-facturation-preparation',
  templateUrl: './facturation-preparation.component.html',
  styleUrls: ['./facturation-preparation.component.scss']
})
export class FacturationPreparationComponent implements OnInit {
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public advancedHeaders = this.service.getAdvancedHeaders();
  client_code = "";
  nom_client = "";

  dialogRef: MatDialogRef<DialogDetailsFacturationComponent>;

  constructor(private route: ActivatedRoute, 
    private service: FacturationPreparationService,
    public dialog: MatDialog,
    private router: Router,
    ) { }
  ngOnInit(): void {
    this.getFacturation(this.route.snapshot.params.client);
  }

  getFacturation(client_code){
    this.client_code = client_code;
    var data = {
      "code_client": client_code
    }
    this.service.getMonthListFacturationForClient(data).subscribe(res => {
      this.advancedTable = res.months.reverse();
      this.nom_client = res.nom_client;
      this.service.setClient(this.nom_client);
    },
    err =>{})
  }


  opendetailsDialog(data) {
    this.dialogRef = this.dialog.open(DialogDetailsFacturationComponent, {
      width: "fit-content",
      minWidth: "800px",
      maxWidth: "fit-content",
      minHeight: 'fit-content',
      maxHeight: 'calc(100vh - 90px)',
      height : 'fit-content',

      disableClose: false
    });
    this.dialogRef.componentInstance.mois = data;
    // if (decision == 'activer') {
    //   this.dialogRef.componentInstance.confirmMessage = "Voulez-vous activer la capacité ?"
    // } else if (decision == 'suspendre') {
    //   this.dialogRef.componentInstance.confirmMessage = "Voulez-vous suspendre la capacité ?"
    // }
    this.dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   if (decision == 'activer') {
      //     this.activerCapacite();
      //   } else if (decision == 'suspendre') {
      //     this.suspendreCapacite();
      //   }
      // }
      this.dialogRef = null;
    });
  }

  opendetails(data){
    console.log(data);
    this.router.navigate([`/details-facture/${this.client_code}/${data}`]);
  }

  navigatetoAddFacturation(){
    this.router.navigate([`/add-facture/${this.client_code}`]);
  }

}
