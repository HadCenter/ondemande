import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';


@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit,AfterViewInit{
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
    this.transaction = JSON.parse(this.service.getDetailTransactionSynchrone(this.route.snapshot.params.id));
  }
  ngAfterContentInit() {
    if ( this.transaction.fichier_livraison_sftp != null){
      console.log("Début getLivraisonFile");
      this.getLivraisonFile();
      console.log("Fin getLivraisonFile");
    }
    else{
      this.showLowderLivraisonFile = false;
    }
    if (this.transaction.fichier_exception_sftp != null) {
      console.log("Début getExceptionFile");
      this.getExceptionFile();
      console.log("Début getExceptionFile");
    }
    else{
      this.showLowderExceptionFile = false;
    }
    if (this.transaction.fichier_metadata_sftp != null) {
      console.log("Début getMetadataFile");
      this.getMetadataFile();
      console.log("Début getMetadataFile");
    }
    else{
      this.showLowderMetadataFile = false;
    }
    if (this.transaction.fichier_mad_sftp != null) {
      console.log("Début getMadFile");
      this.getMadFile();
      console.log("Début getMadFile");
    }
    else{
      this.showLowderMadFile = false;
    }

  }
  getDetailTransaction(route_param_id)
  {

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
    var tableau_res = this.service.getDataSynchronous(data);
    var dataSource = JSON.parse(tableau_res);
    dataSource.rows.splice(0, 0, dataSource.columns);
    for(var i = 0; i < dataSource.rows.length; i++){
      dataSource.rows[i].splice(0,3);
    }
    if (dataSource.rows.length > 1 ){
      this.dataSourceLivraison = this.convertToArrayOfObjects(dataSource.rows);
      this.displayedColumnsLivraison =Object.keys(this.dataSourceLivraison[0]);
    }else{
      this.dataSourceLivraison = [];
      this.displayedColumnsLivraison = dataSource.columns;
    }
    this.showLowderLivraisonFile = false;
  }
  getExceptionFile()
  {
    var data = {
      "fileType": "exception",
      "transaction_id": this.transaction.transaction_id,
    }
    var tableau_res = this.service.getDataSynchronous(data);
    var dataSource = JSON.parse(tableau_res);
    dataSource.rows.splice(0, 0, dataSource.columns);
    for(var i = 0; i < dataSource.rows.length; i++){
      dataSource.rows[i].splice(0,3);
    }
    if (dataSource.rows.length > 1 ){
      this.dataSourceException = this.convertToArrayOfObjects(dataSource.rows);
      this.displayedColumnsException =Object.keys(this.dataSourceException[0]);
    }else{
      this.dataSourceException = [];
      this.displayedColumnsException = dataSource.columns;
    }
    this.showLowderExceptionFile = false;
  }
  getMetadataFile()
  {
    var data = {
      "fileType": "metadata",
      "transaction_id": this.transaction.transaction_id,
    }
    var tableau_res = this.service.getDataSynchronous(data);
    var dataSource = JSON.parse(tableau_res);
    dataSource.rows.splice(0, 0, dataSource.columns);
    for(var i = 0; i < dataSource.rows.length; i++){
      dataSource.rows[i].splice(0,3);
    }
    if (dataSource.rows.length > 1 ){
      this.dataSourceMetadata = this.convertToArrayOfObjects(dataSource.rows);
      this.displayedColumnsMetadata = Object.keys(this.dataSourceMetadata[0]);
    }else{
      this.dataSourceMetadata = [];
      this.displayedColumnsMetadata = dataSource.columns;
    }
    this.showLowderMetadataFile = false;
  }
  getMadFile()
  {
    var data = {
      "fileType": "mad",
      "transaction_id": this.transaction.transaction_id,
    }
    var tableau_res = this.service.getDataSynchronous(data);
    var dataSource = JSON.parse(tableau_res);
    dataSource.rows.splice(0, 0, dataSource.columns);
    for(var i = 0; i < dataSource.rows.length; i++){
      dataSource.rows[i].splice(0,3);
    }
    if (dataSource.rows.length > 1 ){
      this.dataSourceMad = this.convertToArrayOfObjects(dataSource.rows);
      this.displayedColumnsMad =Object.keys(this.dataSourceMad[0]);
    }else{
      this.dataSourceMad = [];
      this.displayedColumnsMad = dataSource.columns;
    }
    this.showLowderMadFile = false;
  }
}




