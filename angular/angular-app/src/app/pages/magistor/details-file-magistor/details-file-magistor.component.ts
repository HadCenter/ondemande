import { Component, OnInit } from '@angular/core';
import { DetailsFileMagistorService } from '../details-file-magistor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-file-magistor',
  templateUrl: './details-file-magistor.component.html',
  styleUrls: ['./details-file-magistor.component.scss']
})
export class DetailsFileMagistorComponent implements OnInit {
  file: any;
  fileMagistor: any;
  copyfileMagistor: any;
  displayedColumns:any;
  constructor(
    private route: ActivatedRoute,
    private fileService: DetailsFileMagistorService) { }

  ngOnInit(): void {
    this.fileService.getFile(this.route.snapshot.params.id).subscribe(
      resp => {
        this.file = resp;
        var data = {
          "logisticFileName": this.file.logisticFileName.name,
        }
        this.fileService.getLogisticFileContent(data).subscribe(res => {
          this.fileMagistor = res;
          if (this.fileMagistor.rows.length > 0) {
            this.copyfileMagistor = JSON.parse(JSON.stringify(this.fileMagistor));

            this.copyfileMagistor.rows.splice(0, 0, this.copyfileMagistor.columns);
            this.copyfileMagistor = this.convertToArrayOfObjects(this.copyfileMagistor.rows);
            this.displayedColumns = (Object.keys(this.copyfileMagistor[0]))
          }
          })
      })

  }

  convertToArrayOfObjects(data) {
    var keys = data.shift(),
      i = 0, k = 0,
      obj = null,
      output = [];
    for (i = 0; i < data.length; i++) {
      obj = {};
      for (k = 0; k < keys.length; k++) {
        obj[keys[k]] = data[i][k];
      }
      output.push(obj);
    }
    return output;
  }
}
