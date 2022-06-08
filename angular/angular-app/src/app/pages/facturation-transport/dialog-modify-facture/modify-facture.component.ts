import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturationTransportService } from '../facturation-transport.service';

@Component({
  selector: 'app-modify-facture',
  templateUrl: './modify-facture.component.html',
  styleUrls: ['./modify-facture.component.scss']
})
export class ModifyFactureComponent implements OnInit {
  public facture: any;
  public myForm: FormGroup;
  public username;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string = "Admin";
  public activated: string = "Non actif";
  public canUpdateCapacity: boolean;
  public listItems: Array<string> = ["Admin", "SuperAdmin"];
  showloader = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];
  prixHT: any;
  apiErrorRaise: boolean = false;
  submitClicked: boolean = false;
  dataChanged: boolean = false;
  copyfacture: any;
  constructor(
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    private service: FacturationTransportService,
    public dialogRef: MatDialogRef<ModifyFactureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.facture = this.data;
    this.copyfacture = this.facture.RL_Prix_H_T__c;
    this.myForm = this.fb.group({
      prixHT: new FormControl('', [
        Validators.required,
      ])
    });
    this.prixHT = this.myForm.get('prixHT');

  }

  ngOnInit(): void {
  }

  updateFacturePrice(facture) {
    this.apiErrorRaise = false;
    this.submitClicked = true;
    var data = {
      "idFacture": facture.Id,
      "price": facture.RL_Prix_H_T__c
    }
    console.log(data);
    this.service.updateFacture(data).subscribe(
      res => {
        this.dialogRef.close('submit');
      },
      err => {
        this.apiErrorRaise = true;
        this.submitClicked = false;
      })

  }
}
