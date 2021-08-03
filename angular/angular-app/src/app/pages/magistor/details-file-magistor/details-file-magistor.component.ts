import { Component, OnInit } from '@angular/core';
import { DetailsFileMagistorService } from '../details-file-magistor.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-file-magistor',
  templateUrl: './details-file-magistor.component.html',
  styleUrls: ['./details-file-magistor.component.scss']
})
export class DetailsFileMagistorComponent implements OnInit {
  file: any = [];
  testFile: any = [];
  files: any = [];
  filterValues: any = [];
  fileMagistor: any;
  copyfileMagistor: any;
  displayedColumns: any;
  typeFileART: boolean = false;
  typeFileREC: boolean = false;
  typeFileCDC: boolean = false;
  options: any = [];
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
        if (this.file.logisticFileType == "ART01") {
          this.typeFileART = true;
        }
        else if (this.file.logisticFileType == "REC01") {
          this.typeFileREC = true;
        }
        else if (this.file.logisticFileType == "CDC01") {
          this.typeFileCDC = true;
        }
        this.fileService.getLogisticFileContent(data).subscribe(res => {
          this.fileMagistor = res;

          if (this.fileMagistor.rows.length > 0) {
            this.copyfileMagistor = JSON.parse(JSON.stringify(this.fileMagistor));
            this.copyfileMagistor.rows.splice(0, 0, this.copyfileMagistor.columns);
            this.copyfileMagistor = this.convertToArrayOfObjects(this.copyfileMagistor.rows);
            this.testFile = this.copyfileMagistor;   //copy to use on selection
            this.files = this.copyfileMagistor;    // copy to filter *
            this.displayedColumns = (Object.keys(this.copyfileMagistor[0]));
            // get select options
            this.displayedColumns.forEach(item => {
              this.getOption(item);
            })
          }
        })
      })
  }

  /**
    * Get options inside selects
    * @param filter
    */
  getOption(filter) {
    let options = [];
    options = this.testFile.map((item) => item[filter]);
    options = options.filter(function (value, index, options) {
     
      return options.indexOf(value) == index && value !== "";
    });
    this.displayedColumns.forEach((item, key) => {
      if (item == filter) {
        var obj = {
          columnProp: item,
          options: options
        };
        this.options.push(obj);
      }
    })
  }



  getIntersection(filter) {
    return this.copyfileMagistor.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1
      // return item[filter.columnProp] == String(filter.modelValue);

    });
  }

  filterChange(filter) {
  //  this.initSelectedCells();     // init selected cells
    this.files = this.files.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
    return this.files.filter(function (item) {
      return filter.modelValue.indexOf(item[filter.columnProp]) !== -1

    });
  }

    /**
* change color of the selected column header on file livraison
*/
changeSelectedOptionColor(filter) {
  if (filter.columnProp && filter.modelValue != "") {
    document.getElementById(filter.columnProp).style.color = "#00bcd4";
  }
  else {
    document.getElementById(filter.columnProp).style.color = "white";
  }
}


  setFilteredItemsOptions(filter) {
    // check if filter is already selected
    const filterExists = this.filterValues.some(f => f.columnProp === filter.columnProp);
    this.changeSelectedOptionColor(filter);
    if (filterExists == false) { this.filterValues.push(filter) }
    // if only one select is selected
    if (this.filterValues.length == 1) {
      this.copyfileMagistor = this.filterChange(filter);
    }
    else {
      // if already another select is active merge the results
      if (filterExists == false) {
        this.copyfileMagistor = this.getIntersection(filter)
      }
      else {
        this.copyfileMagistor = this.files;
        this.filterValues.forEach(element => {
          this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
        this.copyfileMagistor = this.copyfileMagistor.filter((object, index) => index === this.copyfileMagistor.findIndex(obj => JSON.stringify(obj) === JSON.stringify(object)));
      }
    }

    // if selected is deactivate
    if (filter.modelValue == "" || filter.modelValue.length == 0) {

      this.filterValues = this.filterValues.filter(item => item.columnProp != filter.columnProp);
      if (this.filterValues.length == 0) {
        this.copyfileMagistor = this.testFile;
        this.copyfileMagistor = this.copyfileMagistor.sort((a, b) => (a.Remarque_id > b.Remarque_id) ? 1 : -1);
      }
      else if (this.filterValues.length == 1) {
        this.copyfileMagistor = this.filterChange(this.filterValues[0])
      }
      else {
        this.filterValues = this.filterValues.filter(function (item) {

          return item.columnProp !== filter.columnProp;
        })
        this.copyfileMagistor = this.testFile;
        this.filterValues.forEach(element => {
          this.copyfileMagistor = this.copyfileMagistor.filter(x => element.modelValue.includes(x[element.columnProp]));
        });
      }
    }

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
