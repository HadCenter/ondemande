import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImportFileEdiService } from './import-file-edi.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
  clicked = false;
//   myControl = new FormControl();
//   options: string[] = ['One', 'Two', 'Three'];
//   filteredOptions: Observable<string[]>;

  show = false;
  clicked  = false;
  stateGroups: StateGroup[] = [];
  nameGroups: StateGroup[] = [{
    letter: 'A',
    names: []
  },
  {
    letter: 'B',
    names: []
  },
  {
    letter: 'C',
    names: []
  },
  {
    letter: 'D',
    names: []
  },
  {
    letter: 'E',
    names: []
  },
  {
    letter: 'F',
    names: []
  }, {
    letter: 'G',
    names: []
  }, {
    letter: 'H',
    names: []
  }, {
    letter: 'I',
    names: []
  },
  {
    letter: 'J',
    names: []
  },
  {
    letter: 'K',
    names: []
  }, {
    letter: 'L',
    names: []
  }, {
    letter: 'M',
    names: []
  }, {
    letter: 'N',
    names: []
  }, {
    letter: 'O',
    names: []
  }, {
    letter: 'P',
    names: []
  },
  {
    letter: 'Q',
    names: []
  },
  {
    letter: 'R',
    names: []
  },
  {
    letter: 'S',
    names: []
  },
  {
    letter: 'T',
    names: []
  }, {
    letter: 'U',
    names: []
  }, {
    letter: 'V',
    names: []
  }, {
    letter: 'W',
    names: []
  },
  {
    letter: 'X',
    names: []
  },
  {
    letter: 'Y',
    names: []
  },
  {
    letter: 'Z',
    names: []
  }];

  stateGroupOptions: Observable<StateGroup[]>;

  minWidth: number = 250;
  width: number = this.minWidth;
  public error: string = '';

  myForm = new FormGroup({
    stateGroup: new FormControl('', [Validators.required],),
    file: new FormControl('',),
    fileSource: new FormControl('')
  });
  selectedFiles: File = null;
  //   selectedStates = [];
  constructor(private importFileService: ImportFileEdiService, private router: Router) {
    this.dropdownRefresh();
    //     this.selectedStates = this.listItems;
  }
  public listObject: { id: string, nom_client: string }[] = [];
  public listItems: Array<string> = [];
  ngOnInit(): void {
    this.stateGroupOptions = this.myForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }
  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: _filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  selectFile(event) {
    if (event.target.files.length > 0) {
      this.selectedFiles = <File>event.target.files[0];
      this.myForm.patchValue({
        fileSource: this.selectedFiles
      });
    }

  }
  dropdownRefresh() {
    this.importFileService.getAllClients().subscribe(
      data => {
        data.forEach(element => {
          this.listItems.push(element["nom_client"]);
          var id = element['id']; var nomClient = element['nom_client'];
          var client = {
            id: id,
            nom_client: nomClient
          };
          this.listObject.push(client);
        });
        // console.log(this.listItems);
        for (var i = 0; i < this.nameGroups.length; i++) {
          for (var j = 0; j < this.listItems.length; j++) {
            if (this.listItems[j][0] === this.nameGroups[i].letter) {
              this.nameGroups[i].names.push(this.listItems[j]);
            }
          }
        }
        for (var k = 0; k < this.nameGroups.length; k++) {
          if (this.nameGroups[k].names.length !== 0) {
            this.stateGroups.push(this.nameGroups[k])
          }
        }

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
  get f() {
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

    this.show = true;
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    var nom = this.myForm.getRawValue().stateGroup;
    var client = this.listObject.find(element => element.nom_client === nom);
    formData.append('client', client.id);
    // console.log(formData.get('file'));
    // console.log(formData.get('client'));
    this.importFileService.upload(formData).subscribe(
      (res) => {
        console.log("success");
        this.show = false;
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


