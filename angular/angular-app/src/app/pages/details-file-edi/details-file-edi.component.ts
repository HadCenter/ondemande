import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
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
  fileTocheck: { columns: any; rows: any; };
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
    })
  }

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      this.fileValid = res;
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
    // this.fileService.postFile(this.fileWrong).subscribe(res=>{

    // })
    console.log("wrong file", this.fileWrong);
    console.log('correct file ', this.fileValid.rows);
    this._fileWrong = this.fileWrong;
    this._fileWrong.rows.forEach(element => {
      element = element.pop();
    });
    this.fileTocheck = {
      columns: this._fileWrong.columns.splice(0, this._fileWrong.columns.length - 1),
      rows: this.fileValid.rows.concat(this._fileWrong.rows),
    }

    console.warn("****", this.fileTocheck)
  }


}
