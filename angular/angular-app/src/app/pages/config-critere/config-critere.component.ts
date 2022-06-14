
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  copy_matrice: any = [];
  showLoaderMatrice = true;
  removedCritere: any = [];

  constructor(private route: ActivatedRoute, public router: Router,
    private service: ConfigCritereService, private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    let data = {
      "code_client": this.route.snapshot.params.id
    }
    this.getMatrice(data);
  }

  getMatrice(code_client) {
    this.service.getMatricePerClient(code_client).subscribe(res => {
      console.warn(res);
      this.copy_matrice = JSON.parse(JSON.stringify(res));
      // this.copy_matrice = [...res];
      this.matrice = res;
      if (this.matrice.length >= 1) {
       this.showLoaderMatrice = false;
      }

    })
  }


  addNewCrietere() {
    let obj = {
      code_client: this.route.snapshot.params.id,
      param: "",
      productivite: this.matrice[0].productivite,
      CHP: "",
      CHC: "",
      forfaitNbHeure: "",
      forfaitNbHeureCoord: "",
      TP: "",
      marge: this.matrice[0].marge,
    }
    if(this.removedCritere.length >= 1){
      obj= this.removedCritere.pop();
    }
    this.matrice.push(obj);
  }

  removeCrietere(){
    this.removedCritere.push(this.matrice.pop());
  }

  /***************check two array are equals **********/
  equals(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  /****************Update matrice ************************/
  updateMatrice() {
  
    this.updateProductivite(this.matrice[0].productivite);
    this.updateMarge(this.matrice[0].marge);
    if (this.equals(this.matrice, this.copy_matrice) == true) {
      this.openSnackBar('Aucune modification efféctuée!', 'Fermé');
    }
    else if (this.checkIfValueEmpty(this.matrice)) {
      this.showLoaderMatrice=true;
      let dataToUpdate = {
        "code_client": this.route.snapshot.params.id,
        "parameters": this.matrice,
      }

      console.log("dataToUpdate", dataToUpdate)
      this.service.updateAllMatrice(dataToUpdate).subscribe(res => {
        console.log("res", res);
        this.openSnackBar('Modification effectuée avec succées', 'Fermé');
        this.router.navigate(['/facturation-preparation']);
      })
    }
    else {
      this.openSnackBar('Veuillez remplir tous les champs nécessaires !', 'Fermé');
    }

  }

  // convertToArrayOfArray(arr) {
  //   return arr.map(function (obj) {
  //     return Object.keys(obj).map(function (key) {
  //       return obj[key];
  //     });
  //   });

  // }

  checkIfValueEmpty(arr) {
    return arr.every(item => item.productivite && item.CHP && item.TP && item.CHC && item.forfaitNbHeure && item.forfaitNbHeureCoord && item.marge);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snackbar']
    });
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

  updateProductivite(string) {
    this.matrice.forEach(element => {
      element.productivite = string;
    });
  }

  updateMarge(string) {
    this.matrice.forEach(element => {
      element.marge = string;
    });
  }

}
