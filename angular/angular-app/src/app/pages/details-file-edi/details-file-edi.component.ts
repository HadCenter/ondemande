import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsFileEdiService } from './details-file-edi.service';
import * as XLSX from 'xlsx';
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

  constructor(private route: ActivatedRoute, private fileService: DetailsFileEdiService) {
    super();
  }

  ngOnInit(): void {
    this.show = true;
    this.getFile(this.route.snapshot.params.id);

  }

  getWrongFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.wrongCommands,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      console.log("res", res)
      this.fileWrong = res;
      this.show = false;
    })
    // this.getValidFile();
  }

  getValidFile() {
    var data = {
      "clientCode": this.file.contact.codeClient,
      "fileName": this.file.validatedOrders,
    }
    this.fileService.getFileEdi(data).subscribe(res => {
      console.log("res", res)
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
    console.warn("****", this.fileWrong)
  }


}
