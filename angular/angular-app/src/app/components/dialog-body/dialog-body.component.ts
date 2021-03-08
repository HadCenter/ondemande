import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import {
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

export class Client {
  id?: string;
  code_client?: string;
  nom_client?: string;
  email?: string;
}

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent implements OnInit {

  currentClient : Client = {
    id : '',
    code_client: '',
    nom_client: '',
    email: ''
  };

  constructor(public dialogRef: MatDialogRef<DialogBodyComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.currentClient.nom_client = this.data.data.nom_client;
    this.currentClient.id = this.data.data.id;
  }
  close() {
    this.dialogRef.close();
  }

}
