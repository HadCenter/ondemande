import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ImportFileEdiService } from './import-file-edi.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-import-file-edi',
  templateUrl: './import-file-edi.component.html',
  styleUrls: ['./import-file-edi.component.scss']
})
export class ImportFileEdiComponent implements OnInit {
//   myControl = new FormControl();
//   options: string[] = ['One', 'Two', 'Three'];
//   filteredOptions: Observable<string[]>;
  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: '',
  });
  stateGroups: StateGroup[] = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['Delaware']
  }, {
    letter: 'F',
    names: ['Florida']
  }, {
    letter: 'G',
    names: ['Georgia']
  }, {
    letter: 'H',
    names: ['Hawaii']
  }, {
    letter: 'I',
    names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  }, {
    letter: 'K',
    names: ['Kansas', 'Kentucky']
  }, {
    letter: 'L',
    names: ['Louisiana']
  }, {
    letter: 'M',
    names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  }, {
    letter: 'N',
    names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  }, {
    letter: 'O',
    names: ['Ohio', 'Oklahoma', 'Oregon']
  }, {
    letter: 'P',
    names: ['Pennsylvania']
  }, {
    letter: 'R',
    names: ['Rhode Island']
  }, {
    letter: 'S',
    names: ['South Carolina', 'South Dakota']
  }, {
    letter: 'T',
    names: ['Tennessee', 'Texas']
  }, {
    letter: 'U',
    names: ['Utah']
  }, {
    letter: 'V',
    names: ['Vermont', 'Virginia']
  }, {
    letter: 'W',
    names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  }];

  stateGroupOptions: Observable<StateGroup[]>;

  minWidth: number = 250;
  width: number = this.minWidth;
  public error: string = '';

  myForm = new FormGroup({
    name: new FormControl('', [Validators.required],),
    file: new FormControl('',),
    fileSource: new FormControl('')
  });
  selectedFiles : File = null;
//   selectedStates = [];
  constructor(private importFileService: ImportFileEdiService, private _formBuilder: FormBuilder, private router: Router)
  {
    this.dropdownRefresh();
//     this.selectedStates = this.listItems;
  }
  public listObject : { id: string, nom_client: string }[] = [];
  public listItems : Array<string> = [];
  ngOnInit(): void {
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }
  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  selectFile(event)
  {
    if (event.target.files.length > 0) {
      this.selectedFiles = <File>event.target.files[0];
      this.myForm.patchValue({
        fileSource: this.selectedFiles
      });
    }

  }
  dropdownRefresh()
  {
    this.importFileService.getAllClients().subscribe(
      data => {
          data.forEach(element => {
              this.listItems.push(element["nom_client"]);
              var id = element['id']; var nomClient = element['nom_client'];
              var client = {
                  id : id,
                  nom_client : nomClient
              };
              this.listObject.push(client);
          });
          console.log(this.listItems);
          console.log(this.listObject);
//           this.filteredOptions = this.myControl.valueChanges
//             .pipe(
//             startWith(''),
//             map(value => this._filter(value))
//           );
      });
  }
//   private _filter(value: string): string[] {
//     const filterValue = value.toLowerCase();
//
//     return this.listItems.filter(option => option.toLowerCase().includes(filterValue));
//   }
  get f(){
    return this.myForm.controls;
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }
  }

  submit()
  {
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    var nom = this.myForm.getRawValue().name;
    var client = this.listObject.find(element => element.nom_client === nom);
    formData.append('client', client.id);
    console.log(formData.get('file'));
    console.log(formData.get('client'));
    this.importFileService.upload(formData).subscribe(
      (res) => {
        console.log("success");
        this.router.navigate(['/list-file-edi']);
      },
      (err) => {
        this.error = "SVP, Télécharger un fichier EDI !";
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
//   onKey(value)
//   {
//     this.selectedStates = this.search(value);
//   }
//
//
// search(value: string)
//  {
//   let filter = value.toLowerCase();
//   return this.listItems.filter(option => option.toLowerCase().startsWith(filter));
//  }


}


