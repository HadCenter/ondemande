
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
        this.productivite = this.matrice[0].productivité;
        this.marge = this.matrice[0].marge;
      }

    })
  }


  addNewCrietere() {
    let obj = {
      CHC: "",
      CHP: "",
      TP: "",
      forfaitNbHeure: "",
      forfaitNbHeureCoord: "",
      marge: "",
      param: "",
      productivité: "",
    }
    this.matrice.push(obj);
  }


  customTrackBy(index: number, obj: any) {
    return index;
  }

  updateMatrice() {
    if (this.checkIfValueEmpty(this.matrice)) {
      let params = [];
      let keys = [];
      this.newArray = [];
      this.matrice.forEach((element) => {
        params.push(element.param);
        keys = Object.keys(element)
        keys.shift();
        this.newArray = this.convertToArrayOfArray(this.matrice);
       /* console.warn('keys', keys);
        console.log('newArray', this.newArray)
        console.warn('paraù', params)*/
      });


      let dataToUpdate = {
        "param": params,
        "code_client": "C081",
        "keys": keys,
      }
      for (let i = 0; i <= params.length - 1; i++) {
        dataToUpdate[params[i]] = this.newArray[i];
        (dataToUpdate[params[i]]).shift()
      }
      console.error(dataToUpdate)
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
    return arr.every(item => item.productivité && item.CHP && item.TP && item.CHC && item.forfaitNbHeure && item.forfaitNbHeureCoord && item.marge);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }


}
