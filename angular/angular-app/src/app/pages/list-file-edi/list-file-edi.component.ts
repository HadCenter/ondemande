import { Component, HostBinding, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { ListFileEdiService } from './list-file-edi.service';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImportFileEdiService } from './dialog/import-file-edi.service';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-list-file-edi',
  templateUrl: './list-file-edi.component.html',
  styleUrls: ['./list-file-edi.component.scss']
})
export class ListFileEDIComponent extends UpgradableComponent {
  public readonly Array = Array;
  public order: any;
  public snackAction = 'Ok';
  public completeTable: any = [];
  public filterValue: any;
  clicked = new Array();
  limit = 15;
  selection = new SelectionModel<PeriodicElement>(true, []);
  actions: any[] = [
    { value: 'analyser', viewValue: 'Analyser' },
  ];
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  files = [];
  show = true;
  constructor(private tablesService: ListFileEdiService,
    private router: Router,
    public dialog: MatDialog) {
    super();
    this.completeTable = this.tablesService.advanceTableData;
  }
  ngOnInit() {
    this.getFiles();
  }

  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  public advancedHeaders = this.tablesService.getAdvancedHeaders();

  getColor(ch) {
    if (ch === 'En attente') {
      return 'blue';
    } else if (ch === 'Terminé') {
      return 'green';
    } else if (ch === 'En cours') {
      return 'orange';
    } else {
      return 'red';
    }
  }
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public getAdvancedTablePage(page, countPerPage) {
    return this.files.slice((page - 1) * countPerPage, page * countPerPage);
  }
  /* available sort value:
-1 - desc; 	0 - no sorting; 1 - asc; null - disabled */
  public changeSorting(header, index) {
    const current = header.sort;
    if (current !== null) {
      this.advancedHeaders.forEach((cell) => {
        cell.sort = (cell.sort !== null) ? 0 : null;
      });
      header.sort = (current === 1) ? -1 : 1;
      this.changeAdvanceSorting(header.sort, index);
      this.changePage(1, true);
    }
  }
  public changeAdvanceSorting(order, index) {
    this.files = this.sortByAttributeObject(this.files, order, index);
  }

  public sortByAttributeObject(files, order, index) {
    if (index == 1) {
      return this.sortByDateOrder(files, order, index);
    }
    else if (index == 2) {
      return this.sortByClientName(files, order, index);
    }
  }

  private sortByDateOrder(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.created_at.slice(0, 10) > b.created_at.slice(0, 10)) {
        return 1 * order;
      }
      if (a.created_at.slice(0, 10) < b.created_at.slice(0, 10)) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  private sortByClientName(array, order, value) {
    const compareFunction = (a, b) => {
      if (a.client_name > b.client_name) {
        return 1 * order;
      }
      if (a.client_name < b.client_name) {
        return -1 * order;
      }
      return 0;
    }

    return array.sort(compareFunction);
  }

  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }

  setFilteredItems() {
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
  }

  filterItems(filterValue) {
    return this.files.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getFiles() {
    this.tablesService.getAllFiles()
      .subscribe(res => {
        this.files = res;
        this.show = false;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
        for (var i = 0; i < this.advancedTable.length; i++) {
          this.clicked.push(false);
        }
      },
        error => console.log(error));
  }
  public analyserEDI(row) {

    this.tablesService.executeJob(row)
      .subscribe(res => {
        console.log("success");
        this.router.navigate(['/list-file-edi']);
      }, error => console.log(error));
  }
  public actualiser() {
    this.advancedTable = [];
    this.show = true;
    this.files = [];
    this.getFiles();
  }
  public uploadFileInput(clientName, fileName) {
    fileName = fileName.substring(7)
    fileName = decodeURIComponent(fileName);

    this.tablesService.uploadFileInput(clientName, fileName)
      .subscribe(res => {
        saveAs(res, fileName);
      }, error => console.log(error));
  }
  public decodefile(file) {

    return decodeURIComponent(file.substring(7));
  }
  public decodeValidatorError(file) {

    return decodeURI(file);
  }
  public uploadFileOutput(clientName, fileName) {
    fileName = decodeURIComponent(fileName);
    this.tablesService.uploadFileOutput(clientName, fileName)
      .subscribe(res => {
        console.log(res);
        saveAs(res, fileName);
      }, error => console.log(error));
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogImportFile);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }

    });
  }

}

export interface StateGroup {
  letter: string;
  names: string[];
}
export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  //selector: 'app-import-file-edi',
  templateUrl: 'dialog/import-file-edi.component.html',
  styleUrls: ['dialog/import-file-edi.component.scss']
})
export class DialogImportFile {

  showloader = false;
  clicked = false;
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

  constructor(private importFileService: ImportFileEdiService,
    private router: Router,
    public dialogRef: MatDialogRef<DialogImportFile>,
  ) {
    this.dropdownRefresh();
  }
  public listObject: { id: string, nom_client: string }[] = [];
//   public listObject: { code_client : string ,nom_client: string }[] = [];
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
//           this.listItems.push(element["last_name"]);
//           var code_client = element['code_client'];
//           var nomClient = element['last_name'];
           this.listItems.push(element["nom_client"]);var id = element['id']; var nomClient = element['nom_client'];
          var client = {
//             code_client: code_client,
            id: id,
            nom_client: nomClient
          };
          this.listObject.push(client);
        });
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

      });
  }

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

  onNoclick() {
    this.dialogRef.close();
  }

  submit() {
    this.showloader = true;
    const formData = new FormData();
    formData.append('file', this.myForm.get('fileSource').value);
    var nom = this.myForm.getRawValue().stateGroup;
    var client = this.listObject.find(element => element.nom_client === nom);
    formData.append('client', client.id);
//     formData.append('client', client.code_client);
    this.importFileService.upload(formData).subscribe(
      (res) => {
        this.showloader = false;
        this.dialogRef.close('submit');
      },
      (err) => {
        this.showloader = false;
        this.error = "SVP, Télécharger un fichier EDI !";
      }
    );
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}

