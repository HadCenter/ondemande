import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends UpgradableComponent implements OnInit {
  nameSelected = new FormControl();
  fileSelected = new FormControl();
  typeAnomaliesSelected = new FormControl();
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  listClients: any = [];
  listFiles: any = [];
  allAnomalies: any;
  // uniqueClients: any=[];
  allAnomalies_copy: any = [];
  listClientsNames: any = [];
  listFilesNames: any = [];
  listTypesAnomalies: any = [];
  listTypesAnomaliesNames: any = [];
  rangeDate: any = null;


  constructor(public tablesService: HomeService, private router: Router,) { super(); }

  ngOnInit(): void {
    this.tablesService.getAllAnomalies().subscribe(res => {
      this.allAnomalies = res;
      this.allAnomalies_copy = res;
      this.getAllClients();
      this.getAllFiles();
      this.getAllTypesANomalie();
    })

  }

  getAllClients() {
    const uniqueClients = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id)) === i);
    uniqueClients.forEach(element => {

      // var client = {
      //   "client_name": element.client_name,
      //   "client_id": element.client_id,
      // }
      // this.listClients.push(client);
      this.listClientsNames.push(element.client_name)
    });
    console.log("nameSelected", this.nameSelected)
  }


  getAllFiles() {
    const uniqueFiles = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.edi_file_id === v.edi_file_id)) === i);
    uniqueFiles.forEach(element => {

      // var file = {
      //   "edi_file_id": element.edi_file_id,
      //   "edi_file_name": element.edi_file_name,
      // }
      // this.listFiles.push(file);
      this.listFilesNames.push(element.edi_file_name)
    });
    console.log("file selected", this.fileSelected)
  }

  getAllTypesANomalie() {
    const uniqueTypesAnomalie = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.anomalie_name === v.anomalie_name)) === i);
    uniqueTypesAnomalie.forEach(element => {

      // var typeAnomalie = {
      //   "anomalie_name": element.anomalie_name,
      // }
      // this.listTypesAnomalies.push(typeAnomalie);
      this.listTypesAnomaliesNames.push(element.anomalie_name)
    });
    console.log("typeAnomaliesSelected", this.typeAnomaliesSelected)
  }

  getDate() {
    var start_date: any;
    var end_date: any;
    if (this.range.value.start) {
      start_date = this.toJSONLocal(this.range.value.start);
    }
    else {
      start_date = null;
    }
    if (this.range.value.end) {
      end_date = this.toJSONLocal(this.range.value.end);
    }
    else {
      end_date = null;
    }
    this.rangeDate = {
      'startDate': start_date,
      'endDate': end_date
    }
  }

  // convertir les dates en une chaîne de date conviviale MySQL
  toJSONLocal(date) {
    var local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return (local.toJSON().replace("T", " ")).slice(0, 19)
  }

  changeSelection() {
    console.warn('change', this.nameSelected.value);
  }

}



