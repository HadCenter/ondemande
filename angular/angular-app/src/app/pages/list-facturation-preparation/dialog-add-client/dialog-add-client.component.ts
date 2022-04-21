import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListClientsService } from 'app/pages/list-clients/list-clients.service';
import { Observable } from 'rxjs';
import { ConfigCritereService } from '../../config-critere/config-critere.service';
import { map, startWith } from "rxjs/operators";
import { MatDialogRef } from '@angular/material/dialog';

export class Client {
  constructor(public nomClient: string, public codeClient: string) {

  }
}


@Component({
  selector: 'app-dialog-add-client',
  templateUrl: './dialog-add-client.component.html',
  styleUrls: ['./dialog-add-client.component.scss']
})
export class DialogAddClientComponent implements OnInit {
  ExistingClients: Client[];
  clientControl = new FormControl();
  filteredlistClient: Observable<Client[]>;
  listClientNames: Client[] = [];
  matrice: any = [{
    code_client: "",
    param: "midi",
    productivite: "",
    CHP: "",
    CHC: "",
    forfaitNbHeure: "",
    forfaitNbHeureCoord: "",
    TP: "",
    marge: "",
  }];
  showLoaderDialog = true;
  selectedClient: any;
  code_client: string = "";
  nom_client: string = undefined;
  error: string;
  constructor(private route: ActivatedRoute,
    public router: Router,
    private service: ConfigCritereService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogAddClientComponent>,
    private clientService: ListClientsService) { }

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.clientService.getAllClients().subscribe(res => {
      this.listClientNames = res.map(x => new Client(x.nomClient, x.codeClient));
      //enlever les clients qui ont déjà été ajouté dans la facturation
      this.listClientNames = this.listClientNames.filter(element => {
        return !this.ExistingClients.some(el => {
          return el.codeClient == element.codeClient && el.nomClient == element.nomClient;
        });
      })
      this.showLoaderDialog = false;
      this.filteredlistClient = this.clientControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );
    })
  }

  private _filter(value: string): Client[] {
    const filterValue = value.toLowerCase();
    return this.listClientNames.filter(option => option.nomClient.toLowerCase().includes(filterValue));
  }

  submit() {
    this.showLoaderDialog = true;
    var dataToUpdate : any;
    if(!this.nom_client){
      this.nom_client = this.clientControl.value;
      dataToUpdate = {
        "code_client": this.code_client,
        "nom_client": this.nom_client,
        "parameters": this.matrice,
      }
    }else {
      dataToUpdate = {
      "code_client": this.code_client,
      "parameters": this.matrice,
    }
  }
    this.service.updateAllMatrice(dataToUpdate).subscribe(res => {
      this.openSnackBar('Modification effectuée avec succées', 'Fermé');
      this.dialogRef.close(res.code_client);
      this.showLoaderDialog = false;
    }, err=> {
      this.openSnackBar('Une erreur est survenue', 'Ok');
      this.error = "Une erreur est survenue";
      this.showLoaderDialog = false;
    })
  }

  changeSelectedClient(client: Client, event: any) {
    if (event.isUserInput) {
      this.code_client = client.codeClient;
      this.nom_client = client.nomClient;
      this.matrice.forEach(element => {
        element.code_client = client.codeClient;
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }

}
