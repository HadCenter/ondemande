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
    console.warn("Début *********** ngOnInit")
    this.tablesService.getAllAnomalies().subscribe(res => {
      this.allAnomalies = res;
      this.allAnomalies_copy = res;
      this.getAllClients();
      this.getAllFiles();
      this.getAllTypesANomalie();
      this.initializeFiltredClients();
      this.initializeFiltredFiles();
      this.initializeFiltredTypesAnomalies();
    });
    console.warn("Fin *********** ngOnInit")
  }
  initializeFiltredFiles() {
    console.warn("Début ********* initializeFiltredFiles")
    this.filteredFiles = this.fileControl.valueChanges.pipe(
        startWith<string | File[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_file)),
        map(filter => this.filter_file(filter))
      );
    console.warn("Fin ********* initializeFiltredFiles")
  }
  filter_file(filter: string): File[] {
    console.warn("Début *********** filter_file")
    this.lastFilter_file = filter;
    if (filter) {
      console.warn("Fin *********** filter_file")
      return this.listFilesNames.filter(option => {
        return (
          option.fileName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      console.warn("Fin *********** filter_file")
      return this.listFilesNames.slice();
    }
  }
  initializeFiltredTypesAnomalies() {
    console.warn("Début ********* initializeFiltredTypesAnomalies")
    this.filteredtypesAnomalies = this.typesAnomaliesControl.valueChanges.pipe(
        startWith<string | Anomalie[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_typeanomalie)),
        map(filter => this.filter_TypesAnomalies(filter))
      );
    console.warn("Fin ********* initializeFiltredTypesAnomalies")
  }
  filter_TypesAnomalies(filter: string): Anomalie[] {
    console.warn("Début *********** filter_TypesAnomalies")
    this.lastFilter_typeanomalie = filter;
    if (filter) {
      console.warn("Fin *********** filter_TypesAnomalies")
      return this.listTypesAnomaliesNames.filter(option => {
        return (
          option.anomalieName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      console.warn("Fin *********** filter_TypesAnomalies")
      return this.listTypesAnomaliesNames.slice();
    }
  }
  initializeFiltredClients()
  {
    console.warn("Début ********* initializeFiltredClients")
    this.filteredClients = this.clientControl.valueChanges.pipe(
        startWith<string | Client[]>(""),
        map(value => (typeof value === "string" ? value : this.lastFilter_client)),
        map(filter => this.filter_client(filter))
      );
    console.warn("Fin ********* initializeFiltredClients")
  }
  getAllClients() {
    const uniqueClients = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.client_id === v.client_id)) === i);
    uniqueClients.forEach(element => {
      var client = new Client(element.client_name);
      this.listClientsNames.push(client);
    });
  }


  getAllFiles() {
    const uniqueFiles = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.edi_file_id === v.edi_file_id)) === i);
    uniqueFiles.forEach(element => {
      var file = new File(element.edi_file_name);
      this.listFilesNames.push(file);
    });
  }

  getAllTypesANomalie() {
    const uniqueTypesAnomalie = this.allAnomalies_copy.filter((v, i, a) => a.findIndex(t => (t.anomalie_name === v.anomalie_name)) === i);
    uniqueTypesAnomalie.forEach(element => {
      var anomalie = new Anomalie(element.anomalie_name);
      this.listTypesAnomaliesNames.push(anomalie);
    });
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


  filter_client(filter: string): Client[] {
    console.warn("Début *********** filter_client")
    this.lastFilter_client = filter;
    if (filter) {
      console.warn("Fin *********** filter_client")
      return this.listClientsNames.filter(option => {
        return (
          option.clientName.toLowerCase().indexOf(filter.toLowerCase()) === 0
        );
      });
    } else {
      console.warn("Fin *********** filter_client")
      return this.listClientsNames.slice();
    }

  }

  displayClientFn(value: Client[] | string): string | undefined {
    console.warn("Début *********** displayClientFn")
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((client, index) => {
        if (index === 0) {
          displayValue = client.clientName;
        } else {
          displayValue += ", " + client.clientName;
        }
      });
    } else {
      displayValue = value;
    }
    console.warn("Fin *********** displayClientFn")
    return displayValue;
  }
  displayFileFn(value: File[] | string): string | undefined {
    console.warn("Début *********** displayFileFn")
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((file, index) => {
        if (index === 0) {
          displayValue = file.fileName;
        } else {
          displayValue += ", " + file.fileName;
        }
      });
    } else {
      displayValue = value;
    }
    console.warn("Fin *********** displayFileFn")
    return displayValue;
  }
  displaytypesAnomaliesFn(value: Anomalie[] | string): string | undefined {
    console.warn("Début *********** displaytypesAnomaliesFn")
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((anomalie, index) => {
        if (index === 0) {
          displayValue = anomalie.anomalieName;
        } else {
          displayValue += ", " + anomalie.anomalieName;
        }
      });
    } else {
      displayValue = value;
    }
    console.warn("Fin *********** displaytypesAnomaliesFn")
    return displayValue;
  }

  optionClickedClient(event: Event, client: Client) {
    console.warn("Début *********** optionClickedClient")
    event.stopPropagation();
    this.toggleSelectionClient(client);
    console.warn("Fin *********** optionClickedClient")
  }
  toggleSelectionClient(client: Client) {
    console.warn("Début *********** toggleSelectionClient")
    client.selected = !client.selected;
    if (client.selected) {
      this.selectedClients.push(client);
    } else {
      const i = this.selectedClients.findIndex(
        value =>
          value.clientName === client.clientName
      );
      this.selectedClients.splice(i, 1);
    }
    this.selectedClientsNames = this.selectedClients.map(client => client.clientName);
    console.warn("Fin *********** toggleSelectionClient")
  }
  optionClickedtypeAnomalie(event: Event, anomalie: Anomalie) {
    console.warn("Début *********** optionClickedtypeAnomalie")
    event.stopPropagation();
    this.toggleSelectiontypesAnomalies(anomalie);
    console.warn("Fin *********** optionClickedtypeAnomalie")
  }
  toggleSelectiontypesAnomalies(anomalie: Anomalie) {
    console.warn("Début *********** toggleSelectiontypesAnomalies")
    anomalie.selected = !anomalie.selected;
    if (anomalie.selected) {
      this.selectedtypesAnomalies.push(anomalie);
    } else {
      const i = this.selectedtypesAnomalies.findIndex(
        value =>
          value.anomalieName === anomalie.anomalieName
      );
      this.selectedtypesAnomalies.splice(i, 1);
    }
    this.selectedtypesAnomaliesNames = this.selectedtypesAnomalies.map(anomalie => anomalie.anomalieName);
    console.warn("Fin *********** toggleSelectiontypesAnomalies")
  }
  optionClickedFile(event: Event, file: File) {
    console.warn("Début *********** optionClickedFile")
    event.stopPropagation();
    this.toggleSelectionFile(file);
    console.warn("Fin *********** optionClickedFile")
  }
  toggleSelectionFile(file: File) {
    console.warn("Début *********** toggleSelectionFile")
    file.selected = !file.selected;
    if (file.selected) {
      this.selectedFiles.push(file);
    } else {
      const i = this.selectedFiles.findIndex(
        value =>
          value.fileName === file.fileName
      );
      this.selectedFiles.splice(i, 1);
    }
    this.selectedClientsNames = this.selectedFiles.map(file => file.fileName);
    console.warn("Fin *********** toggleSelectionFile")
  }
}



