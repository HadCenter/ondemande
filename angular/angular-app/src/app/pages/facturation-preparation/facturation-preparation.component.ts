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
  public dates = [];
  public advancedHeaders = this.service.getAdvancedHeaders();
  client_code = "";
  nom_client = "";
  nom_mois: string = "";
  dialogRef: MatDialogRef<DialogDetailsFacturationComponent>;

  constructor(private route: ActivatedRoute,
    private service: FacturationPreparationService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe
  ) { }
  ngOnInit(): void {
    this.getFacturation(this.route.snapshot.params.client);
  }

  getFacturation(client_code) {
    this.client_code = client_code;
    var data = {
      "code_client": client_code
    }
    this.service.getMonthListFacturationForClient(data).subscribe(res => {
      this.advancedTable = res.months.reverse();
      var first_iteration = true;
      var today = new Date();
      this.advancedTable.forEach(element => {
        var date = element.split('-');
        //var nom_mois = new Date(parseInt(date[1]), parseInt(date[0]) - 1, 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
        var month = new Date(parseInt(date[1]), parseInt(date[0]) +1, 1);
        var nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 1);
        
          if (first_iteration ) {
        console.log(Date.parse(month.toDateString()), '==', Date.parse(nextMonth.toDateString()));

            if((Date.parse(month.toDateString()) == Date.parse(nextMonth.toDateString()))){
              this.advancedTable.unshift(this.datePipe.transform(new Date(parseInt(date[1]), parseInt(date[0]), 1), 'MM-yyyy') );
              //this.advancedTable.unshift(new Date(parseInt(date[1]), parseInt(date[0]), 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase() );
  
            }
            first_iteration = false;
  
          }

        // if (first_iteration) {
        // }
        //this.dates.push(new Date(parseInt(date[1]), parseInt(date[0]) , 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase())
      })
      if(this.advancedTable.length == 0){
        this.advancedTable.push(this.datePipe.transform(new Date(today.getFullYear(), today.getMonth() + 1, 1), 'MM-yyyy') );
      }
      this.advancedTable.forEach(element =>{
        var date = element.split('-');
        this.dates.push(new Date(parseInt(date[1]), parseInt(date[0])-1 , 1).toLocaleString('default', { month: 'long', year: 'numeric' }).toLocaleUpperCase())
      })
      console.log(this.advancedTable);
      console.log(this.dates);
      this.nom_client = res.nom_client;
      this.service.setClient(this.nom_client);
    },
      err => { })
  }


  opendetailsDialog(data) {
    this.dialogRef = this.dialog.open(DialogDetailsFacturationComponent, {
      width: "fit-content",
      minWidth: "800px",
      maxWidth: "fit-content",
      minHeight: 'fit-content',
      maxHeight: 'fit-content',
      height: 'fit-content',

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

  opendetails(data) {
    console.log(data);
    this.router.navigate([`/details-facture/${this.client_code}/${data}`]);
  }

  navigatetoAddFacturation() {
    this.router.navigate([`/add-facture/${this.client_code}`]);
  }

}
