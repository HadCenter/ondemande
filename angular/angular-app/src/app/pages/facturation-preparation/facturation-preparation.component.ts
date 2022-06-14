import { DatePipe } from '@angular/common';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogDetailsFacturationComponent } from './dialog-details-facturation/dialog-details-facturation.component';
import { FacturationPreparationService } from './facturation-preparation.service';
import { saveAs } from 'file-saver';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
    this.client_code = this.route.snapshot.params.client;
    this.getFacturation(this.client_code);
  }

  getFacturation(client_code) {
    var data = {
      "code_client": client_code
    }
    this.service.getMonthListFacturationForClient(data).subscribe(res => {
      this.advancedTable = res.months.reverse();
      this.nom_client = res.nom_client;
      this.service.setClient(this.nom_client);
      var today = new Date();
      var currentMonth = today.getMonth() + 1;
      
      //add current month if not already exist
      if(!this.advancedTable.some(el => el.month == this.datePipe.transform(new Date(today.getFullYear(), today.getMonth(), 1), 'MM-yyyy'))){
        this.advancedTable.unshift({ "month": this.datePipe.transform(new Date(today.getFullYear(), today.getMonth(), 1), 'MM-yyyy'), "total": 0 });
      }

      //add next month if not already exist
      if(!this.advancedTable.some(el => el.month == this.datePipe.transform(new Date(today.getFullYear(), currentMonth, 1), 'MM-yyyy'))){
        this.advancedTable.unshift({ "month": this.datePipe.transform(new Date(today.getFullYear(), currentMonth, 1), 'MM-yyyy'), "total": 0 });
      }
  
      this.advancedTable.forEach(element => {
        //permet l'edition du mois actuel(1ere condition) et du mois prochain(2eme condition) et le mois precedent pendant la premiere semaine du mois courant(3eme condition)
        if(element.month == this.datePipe.transform(new Date(today.getFullYear(), today.getMonth(), 1), 'MM-yyyy') 
        || element.month == this.datePipe.transform(new Date(today.getFullYear(), currentMonth, 1), 'MM-yyyy') 
        || (element.month == this.datePipe.transform(new Date(today.getFullYear(), today.getMonth()-1, 1), 'MM-yyyy') && today.getDate() < 7)
        ){
          element.allowEdit = true;
        }else{
          element.allowEdit = false;
        }

        //add alphabetic date to elements
        var date = element.month.split('-');
        element.date = new Date(parseInt(date[1]), parseInt(date[0]) - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' }).toLocaleUpperCase();

      })
    },
      err => { 
        this.openSnackBar('Une erreur est survenue', 'Ok');
        this.backToPreviousPage();
      })
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
    this.dialogRef.componentInstance.code_client = this.client_code;
    this.dialogRef.afterClosed().subscribe(result => {

      this.dialogRef = null;
    });
  }

  opendetails(data) {
    this.router.navigate([`/details-facture/${this.client_code}/${data}`]);
  }

  navigatetoAddFacturation(data) {
    this.router.navigate([`/add-facture/${this.client_code}/${data}`]);
  }

  downloadFile(data) {
    if(data.total>0){
    this.openSnackBar('Téléchargement du fichier en cours...', 'Ok');
    var body = {
      "code_client": this.client_code,
      "mois": data.month
    }
    this.service.downloadFacturationFile(body)
      .subscribe(res => {
        this.openSnackBar('Le fichier est téléchargé avec succès.', 'Ok');
        saveAs(res, "Preparation_" + this.nom_client + "_" + data.month + ".xlsx");
      }, error => this.openSnackBar('Une erreur est survenue', 'Ok')
      );
    }else{
      this.openSnackBar('Facture vide, rien à télécharger.', 'Ok');
    }
  }
  
  backToPreviousPage(){
    this.router.navigate([`/facturation-preparation/`]);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      // verticalPosition: 'bottom',
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
