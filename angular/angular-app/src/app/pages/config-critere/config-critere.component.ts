
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigCritereService } from './config-critere.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-config-critere',
  templateUrl: './config-critere.component.html',
  styleUrls: ['./config-critere.component.scss']
})
export class ConfigCritereComponent implements OnInit {
  matrice: any = [];
  unite: any = 1;
  productivite: any = "";
  marge: any;
  copy_matrice: any = [];
  newArray: any[];
  showLoaderMatrice= true;

  constructor(private route: ActivatedRoute, private service: ConfigCritereService,private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    let data = {
      "code_client": this.route.snapshot.params.id
    }
    this.getMatrice(data);
  }

  getMatrice(code_client) {
    this.service.getMatricePerClient(code_client).subscribe(res => {
      console.warn(res)
      this.copy_matrice = [...res];
      this.matrice = res;
      if (this.matrice.length >= 1) {
        this.showLoaderMatrice=false;
      }

    })
  }


  addNewCrietere() {
    let obj = {
      nom_client:this.matrice[0].nom_client,
      param: "",
      productivite: this.matrice[0].productivite,
      CHP: "",
      CHC: "",
      forfaitNbHeure: "",
      forfaitNbHeureCoord: "",
      TP: "",
      marge: this.matrice[0].marge,


    }
    this.matrice.push(obj);
  }


  customTrackBy(index: number, obj: any) {
    return index;
  }

  updateProductivite(string){
    this.matrice.forEach(element => {
      element.productivite=string;
    });
  }

  updateMarge(string){
    this.matrice.forEach(element => {
      element.marge=string;
    });
  }


  updateMatrice() {
    this.updateProductivite(this.matrice[0].productivite);
    this.updateMarge(this.matrice[0].marge)
    if (this.checkIfValueEmpty(this.matrice)) {
      let params = [];
      let keys = [];
      this.newArray = [];
      this.matrice.forEach((element) => {
        params.push(element.param);
        keys = Object.keys(element)
        keys.splice(0,2);

      });

      this.newArray = this.convertToArrayOfArray(this.matrice);
      console.error( this.newArray )
      let dataToUpdate = {
        "param": params,
        "code_client": this.matrice[0].nom_client,
        "keys": keys,
      }
      for (let i = 0; i <= params.length - 1; i++) {
        dataToUpdate[params[i]] = this.newArray[i];
        (dataToUpdate[params[i]]).splice(0,2)
      }
      console.log("dataToUpdate",dataToUpdate)
      this.service.updateAllMatrice(dataToUpdate).subscribe(res => {
        console.log("res", res)
      })
    }
    else {
      this.openSnackBar('Veuillez remplir tous les champs nécessaires !', 'Fermé');
    }


  }

  convertToArrayOfArray(arr) {
    return arr.map(function (obj) {
      return Object.keys(obj).map(function (key) {
        return obj[key];
      });
    });

  }

  checkIfValueEmpty(arr) {
    return arr.every(item => item.productivite && item.CHP && item.TP && item.CHC && item.forfaitNbHeure && item.forfaitNbHeureCoord && item.marge);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }


}
