import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { throwIfEmpty } from 'rxjs/operators';
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
  fileTocheck: { fileId: any; columns: any; rows: any; };
  _fileWrong: any;

  constructor(private route: ActivatedRoute, private fileService: DetailsFileEdiService) {
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
      console.log("res wrong", res)
      this.fileWrong = res;
      this.show = false;
      console.warn('***filewrong',this.fileWrong)
    })
  }

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileValid = res;
      console.warn('***filevalid',this.fileValid)
    })
  }



  getFile(id: string) {
    this.fileService.get(id)
      .subscribe(
        data => {
          this.file = data;
          console.log("file", this.file);
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
    this._fileWrong = this.fileWrong;
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



    console.warn("****", this.fileTocheck)
    this.fileService.corretFile(this.fileTocheck).subscribe(res => {
      console.log('res correction', res);
      if (res.message=="success"){
        this.getFile(this.file.idFile);
      }
    })


  }

  sendFileToUrbantz() {
    let data = {
      clientCode: this.file.contact.codeClient,
      fileName: this.file.validatedOrders,
    }
    this.fileService.sendFileToUrbantz(data).subscribe(res => {
      console.log("urbantz",res);
    })
  }


}
