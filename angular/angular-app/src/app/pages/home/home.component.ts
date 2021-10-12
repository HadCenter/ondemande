import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";


export class Client {
  constructor(public clientName: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export class File {
  constructor(public fileName: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
export class Anomalie {
  constructor(public anomalieName: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends UpgradableComponent implements OnInit {
  clientControl = new FormControl();
  selectedClients: Client[] = new Array<Client>();
  filteredClients: Observable<Client[]>;
  lastFilter_client: string = "";
  lastFilter_file: string = "";
  lastFilter_typeanomalie: string = "";
  selectedClientsNames : any = [];

  fileControl = new FormControl();
  filteredFiles: Observable<File[]>;
  selectedFiles: File[] = new Array<File>();
  selectedFilesNames : any = [];

  typesAnomaliesControl = new FormControl();
  selectedtypesAnomalies: Anomalie[] = new Array<Anomalie>();
  filteredtypesAnomalies: Observable<Anomalie[]>;
  selectedtypesAnomaliesNames : any = [];

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  listClients: any = [];
  listFiles: any = [];
  allAnomalies: any;
  allAnomalies_copy: any = [];
  listClientsNames: Client[] = [];
  listFilesNames: File[] = [];
  listTypesAnomalies: any = [];
  listTypesAnomaliesNames: Anomalie[] = [];
  rangeDate: any = null;


  constructor(public tablesService: HomeService, private router: Router,) { super(); }

  ngOnInit(): void {
    this.tablesService.getAllAnomalies().subscribe(res => {
      this.allAnomalies = res;
      this.allAnomalies_copy = res;
      this.getAllClients();
      this.getAllFiles();
      this.getAllTypesANomalie();
    });
    /*this.listenToWebSocket();*/
  }

  listenToWebSocket(){
    this.tablesService.messages.subscribe(msg => {
     if (JSON.parse(msg).Running_Jobs && JSON.parse(msg).Running_Jobs.length > 0 ){
        localStorage.setItem('ws', JSON.stringify(JSON.parse(msg)));
      }
    });
  }
  initializeFiltredClients()
  {
    // console.warn("Début ********* initializeFiltredClients")
    this.filteredClients = this.clientControl.valueChanges.pipe(
        startWith<string | Client[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_client)),
        map(filter => this.filter_client(filter))
      );
    // console.warn("Fin ********* initializeFiltredClients")
  }
  initializeFiltredFiles() {
    // console.warn("Début ********* initializeFiltredFiles")
    this.filteredFiles = this.fileControl.valueChanges.pipe(
        startWith<string | File[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_file)),
        map(filter => this.filter_file(filter))
      );
    // console.warn("Fin ********* initializeFiltredFiles")
  }
  initializeFiltredTypesAnomalies() {
    // console.warn("Début ********* initializeFiltredTypesAnomalies")
    this.filteredtypesAnomalies = this.typesAnomaliesControl.valueChanges.pipe(
        startWith<string | Anomalie[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_typeanomalie)),
        map(filter => this.filter_TypesAnomalies(filter))
      );
    // console.warn("Fin ********* initializeFiltredTypesAnomalies")
  }
  filter_client(filter: string): Client[] {
    // console.warn("Début *********** filter_client")
    this.lastFilter_client = filter;
    if (filter) {
      // console.warn("Fin *********** filter_client")
      return this.listClientsNames.filter(option => {
        return (
          option.clientName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      // console.warn("Fin *********** filter_client")
      return this.listClientsNames.slice();
    }
  }
  filter_file(filter: string): File[] {
    // console.warn("Début *********** filter_file")
    this.lastFilter_file = filter;
    if (filter) {
      // console.warn("Fin *********** filter_file")
      return this.listFilesNames.filter(option => {
        return (
          option.fileName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      // console.warn("Fin *********** filter_file")
      return this.listFilesNames.slice();
    }
  }
  filter_TypesAnomalies(filter: string): Anomalie[] {
    // console.warn("Début *********** filter_TypesAnomalies")
    this.lastFilter_typeanomalie = filter;
    if (filter) {
      // console.warn("Fin *********** filter_TypesAnomalies")
      return this.listTypesAnomaliesNames.filter(option => {
        return (
          option.anomalieName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      // console.warn("Fin *********** filter_TypesAnomalies")
      return this.listTypesAnomaliesNames.slice();
    }
  }
  toggleSelection(selected )
  {
    if(selected instanceof Client)
    {
      // console.warn("Début *********** toggleSelectionClient")
      selected.selected = !selected.selected;
      if (selected.selected) {
        this.selectedClients.push(selected);
      } else {
        const i = this.selectedClients.findIndex(
          value =>
            value.clientName === selected.clientName
        );
        this.selectedClients.splice(i, 1);
      }
      this.selectedClientsNames = this.selectedClients.map(client => client.clientName);
      this.clientControl.setValue('');
      // console.warn("Fin *********** toggleSelectionClient")
    }else{
      if(selected instanceof File)
      {
        // console.warn("Début *********** toggleSelectionFile")
        selected.selected = !selected.selected;
        if (selected.selected) {
          this.selectedFiles.push(selected);
        } else {
          const i = this.selectedFiles.findIndex(
            value =>
              value.fileName === selected.fileName
          );
          this.selectedFiles.splice(i, 1);
        }
        this.selectedFilesNames = this.selectedFiles.map(file => file.fileName);
        this.fileControl.setValue('');
        this.changeTypeAomaliesList();
        // console.warn("Fin *********** toggleSelectionFile")
      }else{
        if (selected instanceof Anomalie)
        {
          // console.warn("Début *********** toggleSelectiontypesAnomalies")
          selected.selected = !selected.selected;
          if (selected.selected) {
            this.selectedtypesAnomalies.push(selected);
          } else {
            const i = this.selectedtypesAnomalies.findIndex(
              value =>
                value.anomalieName === selected.anomalieName
            );
            this.selectedtypesAnomalies.splice(i, 1);
          }
          this.selectedtypesAnomaliesNames = this.selectedtypesAnomalies.map(anomalie => anomalie.anomalieName);
          this.typesAnomaliesControl.setValue('');
          // console.warn("Fin *********** toggleSelectiontypesAnomalies")
        }
      }
    }
  }
  changeTypeAomaliesList(){
   // const listAnomalies=[];
    this.listTypesAnomaliesNames=[];
    this.selectedFilesNames.forEach(el => {
     const listAnomalies=this.allAnomalies_copy.filter(element => element.edi_file_name ==el);
    listAnomalies.forEach(element => {
      var anomalie = new Anomalie(element.anomalie_name);
      this.listTypesAnomaliesNames.push(anomalie);
     this.listTypesAnomaliesNames = this.listTypesAnomaliesNames.filter((v, i, a) => a.findIndex(t => (t.anomalieName === v.anomalieName)) === i);
    });
  });

  this.initializeFiltredTypesAnomalies();

  }
  getAllClients() {
    const uniqueClients = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id)) === i);
    uniqueClients.forEach(element => {
      var client = new Client(element.client_name);
      this.listClientsNames.push(client);
    });
    this.initializeFiltredClients();

  }
  getAllFiles() {
    const uniqueFiles = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.edi_file_id === v.edi_file_id)) === i);
    uniqueFiles.forEach(element => {
      var file = new File(element.edi_file_name);
      this.listFilesNames.push(file);
    });
    this.initializeFiltredFiles();
  }
  getAllTypesANomalie() {
    const uniqueTypesAnomalie = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.anomalie_name === v.anomalie_name)) === i);
    uniqueTypesAnomalie.forEach(element => {
      var anomalie = new Anomalie(element.anomalie_name);
      this.listTypesAnomaliesNames.push(anomalie);
    });
    this.initializeFiltredTypesAnomalies();
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
      end_date = this.toJSONLocalEndDate(this.range.value.end);
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
    return (local.toJSON().replace("T", " ")).slice(0, 19);
  }

  toJSONLocalEndDate(date){
    var local = new Date(date);
    local.setHours(local.getHours() + 23.59)
    local.setMinutes((local.getMinutes() - local.getTimezoneOffset())+59);
    local.setSeconds(local.getSeconds() + 59)
    return (local.toJSON().replace("T", " ")).slice(0, 19);
  }

}



