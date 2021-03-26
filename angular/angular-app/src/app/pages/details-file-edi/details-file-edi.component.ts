import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router'
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';
@Component({
  selector: 'app-details-file-edi',
  templateUrl: './details-file-edi.component.html',
  styleUrls: ['./details-file-edi.component.scss']
})
export class DetailsFileEdiComponent extends UpgradableComponent implements OnInit {
  file: any;
  fileWrong: any;
  fileValid: any;
  show = false;
  column: string;
  public snackAction = 'Ok';
  fileTocheck: { fileId: any; columns: any; rows: any; };
  _fileWrong: any;

  constructor(private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fileService: DetailsFileEdiService) {
    super();
  }

  ngOnInit(): void {
    this.show = true;
    this.getFile(this.route.snapshot.params.id);
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

  getWrongFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.wrongCommands,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileWrong = res;
      this.show = false;
      console.warn('***filewrong', this.fileWrong)
    })
  }

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileValid = res;
      console.warn('***filevalid', this.fileValid)
    })
  }

  getFile(id: string) {
    this.fileService.get(id)
      .subscribe(
        data => {
          this.file = data;
          if (this.file.validatedOrders != '_') {
            this.getValidFile();
          }
          if (this.file.wrongCommands != '_') {
            this.getWrongFile();
          }
        },
        error => {
          console.log(error);
        });
  }

  correctionFile() {
    this._fileWrong = JSON.parse(JSON.stringify(this.fileWrong));
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = true;
    }
    this._fileWrong.rows.forEach(element => {
      element = element.pop();
    });
    if (this.fileWrong && this.fileValid) {

      this.fileTocheck = {
        fileId: this.file.idFile,
        columns: this._fileWrong.columns.splice(0, this._fileWrong.columns.length - 1),
        rows: this.fileValid.rows.concat(this._fileWrong.rows),
      }
    }
    else {
      this.fileTocheck = {
        fileId: this.file.idFile,
        columns: this._fileWrong.columns.splice(0, this._fileWrong.columns.length - 1),
        rows: this._fileWrong.rows,
      }
    }
    this.openSnackBar("Demande de correction envoyée, l’action pourrait prendre quelques minutes", this.snackAction);

    console.warn("**file to check**", this.fileTocheck)
    this.fileService.corretFile(this.fileTocheck).subscribe(res => {
      console.log('resultat correction', res);
      if (res.message == "success") {
        this.router.navigate(['/list-file-edi']);
      }
    })

  }

  sendFileToUrbantz() {
    let data = {
      clientCode: this.file.contact.codeClient,
      fileName: this.file.validatedOrders,
    }
    this.fileService.sendFileToUrbantz(data).subscribe(res => {
      console.log("res urbantz", res);
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      // panelClass: ['blue-snackbar']
    });
  }


}
