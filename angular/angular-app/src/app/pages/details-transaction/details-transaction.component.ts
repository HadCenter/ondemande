import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';


@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit {
  transaction:any={};
  showLowderLivraisonFile: boolean = true;
  showLowderExceptionFile: boolean = true;
  showLowderMetadataFile: boolean = true;
  showLowderMadFile: boolean = true;
  displayedColumnsLivraison = [];
  dataSourceLivraison: any;
  displayedColumnsException = [];
  dataSourceException: any;
  displayedColumnsMetadata = [];
  dataSourceMetadata: any;
  displayedColumnsMad = [];
  dataSourceMad: any;

  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
    private _snackBar: MatSnackBar, private router: Router,) { super(); }

  ngOnInit(): void {
    this.getDetailTransaction(this.route.snapshot.params.id);
  }
  getDetailTransaction(route_param_id)
  {
    this.service.getDetailTransaction(route_param_id)
      .subscribe(
        data => {
        console.log(data);
        this.transaction = data;
        if (this.transaction.fichier_livraison_sftp != null){
            this.getLivraisonFile();
        }
        else{
            this.showLowderLivraisonFile = false;
        }
//         if (this.transaction.fichier_exception_sftp != null) {
//             this.getExceptionFile();
//         }
//         else{
//             this.showLowderExceptionFile = false;
//         }
//         if (this.transaction.fichier_metadata_sftp != null) {
//             this.getMetadataFile();
//         }
//         else{
//             this.showLowderMetadataFile = false;
//         }
//         if (this.transaction.fichier_mad_sftp != null) {
//             this.getMadFile();
//         }
//         else{
//             this.showLowderMadFile = false;
//         }

        },
        error => {
          console.log(error);
        });

  }
  convertToArrayOfObjects(data) {
    var keys = data.shift(),
    i = 0, k = 0,
    obj = null,
    output = [];
    for (i = 0; i < data.length; i++)
    {
      obj = {};
      for (k = 0; k < keys.length; k++) {
        obj[keys[k]] = data[i][k];
      }
      output.push(obj);
    }
    return output;
  }
  getLivraisonFile()
  {
    var data = {
      "fileType": "livraison",
      "transaction_id": this.transaction.transaction_id,
    }
    this.service.seeFileContent(data).subscribe(res => {
      var tableau_res = res;
      //create a copy array of object from the res and an array of displayed column
      var dataSource = JSON.parse(JSON.stringify(tableau_res));
      dataSource.rows.splice(0, 0, dataSource.columns);
      if (tableau_res.rows.length > 0 ){
        this.dataSourceLivraison = this.convertToArrayOfObjects(dataSource.rows);
        this.displayedColumnsLivraison =Object.keys(this.dataSourceLivraison[0]);
      }else{
        this.dataSourceLivraison = [];
        this.displayedColumnsLivraison = tableau_res.columns;
      }
      this.showLowderLivraisonFile = false;
      console.log("this.dataSourceLivraison",this.dataSourceLivraison);
      console.log("this.displayedColumnsLivraison",this.displayedColumnsLivraison);
    });
  }
  getExceptionFile()
  {
    var data = {
      "fileType": "exception",
      "transaction_id": this.transaction.transaction_id,
    }
    this.service.seeFileContent(data).subscribe(res => {
      var tableau_res = res;
      //create a copy array of object from the res and an array of displayed column
      var dataSource = JSON.parse(JSON.stringify(tableau_res));
      dataSource.rows.splice(0, 0, dataSource.columns);
      if (tableau_res.rows.length > 0 ){
        this.dataSourceException = this.convertToArrayOfObjects(dataSource.rows);
        this.displayedColumnsException =Object.keys(this.dataSourceException[0]);
      }else{
        this.dataSourceException = [];
        this.displayedColumnsException = tableau_res.columns;
      }
      this.showLowderExceptionFile = false;
      console.log("this.dataSourceException",this.dataSourceException);
      console.log("this.displayedColumnsException",this.displayedColumnsException);
    });
  }
  getMetadataFile()
  {
    var data = {
      "fileType": "metadata",
      "transaction_id": this.transaction.transaction_id,
    }
    this.service.seeFileContent(data).subscribe(res => {
      var tableau_res = res;
      console.log(res);
      //create a copy array of object from the res and an array of displayed column
      var dataSource = JSON.parse(JSON.stringify(tableau_res));
      dataSource.rows.splice(0, 0, dataSource.columns);
      if (tableau_res.rows.length > 0 ){
        this.dataSourceMetadata = this.convertToArrayOfObjects(dataSource.rows);
        this.displayedColumnsMetadata = Object.keys(this.dataSourceMetadata[0]);
      }else{
        this.dataSourceMetadata = [];
        this.displayedColumnsMetadata = tableau_res.columns;
      }
      this.showLowderMetadataFile = false;
      console.log("this.dataSourceMetadata",this.dataSourceMetadata);
      console.log("this.displayedColumnsMetadata",this.displayedColumnsMetadata);
    });
  }
  getMadFile()
  {
    var data = {
      "fileType": "mad",
      "transaction_id": this.transaction.transaction_id,
    }
    this.service.seeFileContent(data).subscribe(res => {
      var tableau_res = res;
      //create a copy array of object from the res and an array of displayed column
      var dataSource = JSON.parse(JSON.stringify(tableau_res));
      dataSource.rows.splice(0, 0, dataSource.columns);
      if (tableau_res.rows.length > 0 ){
        this.dataSourceMad = this.convertToArrayOfObjects(dataSource.rows);
        this.displayedColumnsMad =Object.keys(this.dataSourceMad[0]);
      }else{
        this.dataSourceMad = [];
        this.displayedColumnsMad = tableau_res.columns;
      }
      this.showLowderMadFile = false;
      console.log("this.dataSourceMad",this.dataSourceMad);
      console.log("this.displayedColumnsMad",this.displayedColumnsMad);
    });
  }
}




