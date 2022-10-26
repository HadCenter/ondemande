import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { PowerbiEmbeddedService } from '../powerbi-embedded/powerbi-embedded.service';
import { DetailsUserService } from './dialog-details-frais/details-frais.service';
import { CreateFraisService } from './dialog/create-frais.service';
import { fraisService } from './frais.service';

import {MatExpansionModule} from '@angular/material/expansion';


export interface DialogData {
  currentFrais: Carburant;
  updatetable,

}

@Component({
  selector: 'app-frais',
  templateUrl: './frais.component.html',
  styleUrls: ['./frais.component.scss']
})
export class fraisComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  users = [];
  Frais = [];
  pneumatique = [];
  indice = [];
  entretien = [];
  panelOpenState: boolean = false;


  copyUsersPerPagination = [];
  show = true;
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public CarburantTable = [];
  public PneumatiqueTable = [];
  public EntretienTable = [];
  public IndiceTable = [];
  public carburant = [];
  public code;

  public filterValue: any;
  limit = 15;
  messageService: any;
  public getAdvancedTablePage(page, countPerPage) {
    return this.copyUsersPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }
  public carburantHeaders = this.fraisService.getCarburantHeaders();
  public PneumatiquetHeaders = this.fraisService.getPneumatiqueHeaders();
  public EntretienHeaders = this.fraisService.getEntretienHeaders();
  public IndiceHeaders = this.fraisService.getIndiceHeaders();
  constructor(private fraisService: fraisService,
    private matDialog: MatDialog, private router: Router,) {
    super();

  }
  ngOnInit(): void {
    this.getFrais();
    this.getPneumatique();
    this.getEntretien();
    this.getIndice();

  }
  update() {
    this.messageService.add({severity:'success', summary:'Success', detail:'Data Updated'});
}

delete() {
    this.messageService.add({severity:'warn', summary:'Delete', detail:'Data Deleted'});
}
  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.CarburantTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  setFilteredItems() {
    this.copyUsersPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.CarburantTable = this.CarburantTable;
    }
    this.currentPage = this.copyUsersPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyUsersPerPagination.length / this.countPerPage);
    this.CarburantTable = this.copyUsersPerPagination.slice(0, this.countPerPage);
  }
  filterItems(filterValue) {
    return this.users.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getFrais() {
    this.fraisService.getAllFrais()
      .subscribe(res => {
        this.Frais = res;
        for (var i = 0; i < res.length; i++) {
          if (res[i].is_active == true) {
            res[i].status = "Actif"
          } else {
            res[i].status = "Non actif"
          }
        }
        this.copyUsersPerPagination = this.Frais;
        this.numPage = Math.ceil(res.length / this.countPerPage);
        this.show = false;
        this.CarburantTable = this.getAdvancedTablePage(1, this.countPerPage);
      },
        error => console.log(error));
  }
  public getPneumatique() {
    this.fraisService.getAllPneumatique()
      .subscribe(res => {
        this.PneumatiqueTable = res;
        for (var i = 0; i < res.length; i++) {
          //if (res[i].is_active == true) {
            res[i].status = "Actif"
          //} else {
          //  res[i].status = "Non actif"
          //}
        }
      },
        error => console.log(error));
  }
  public getEntretien() {
    this.fraisService.getAllEntretien()
      .subscribe(res => {
        this.EntretienTable = res;
        for (var i = 0; i < res.length; i++) {
          //if (res[i].is_active == true) {
            res[i].status = "Actif"
          //} else {
          //  res[i].status = "Non actif"
          //}
        }
      },
        error => console.log(error));
  }
  public getIndice() {
    this.fraisService.getAllIndice()
      .subscribe(res => {
        this.IndiceTable = res;
        for (var i = 0; i < res.length; i++) {
          //if (res[i].is_active == true) {
            res[i].status = "Actif"
          //} else {
          //  res[i].status = "Non actif"
          //}
        }
      },
        error => console.log(error));
  }
  public getProfile(is_superadmin) {
    if (is_superadmin) {
      return "SuperAdmin";
    }
    else {
      return "Admin";
    }
  }
  public getStatus(is_active) {
    if (is_active) {
      return "Actif";
    } else {
      return "Non actif";
    }
  }

  public actualiser() {
    this.CarburantTable = [];
    this.PneumatiqueTable = [];
    this.EntretienTable = [];
    this.IndiceTable = [];
    this.show = true;
    this.getFrais();
    this.getPneumatique();
    this.getEntretien();
    this.getIndice();
  }

  openAddUser() {
    const dialogRef = this.matDialog.open(DialogCreateUser);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });
  }

  openDeleteFrais(frais, table) {
    if (table == 'Carburant')
    {
      this.code = frais.code_Carburant;

    }else if (table == 'Pneumatique')
    {
      this.code = frais.code_Pneumatique;

    }else if (table == 'Entretien')
    {
      this.code = frais.code_Entretien;

    }else if (table == 'Indice')
    {
      this.code = frais.code_IndiceCarburant;
    }
    console.log(frais);
    const dialogRef = this.matDialog.open(DialogDeleteUser, {
      data: {
        currentFrais: frais,
        updatetable:table,
        code: this.code
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });
    
  }
}


@Component({
  templateUrl: './dialog/create-frais.component.html',
  styleUrls: ['./dialog/create-frais.component.scss'],
})
export class DialogCreateUser extends UpgradableComponent {
  public signupForm: FormGroup;
  public is_active = 1;
  public is_deleted = 0;
  public code_carburant;
  public prix;
  public type_Carburant;
  public type_Frais;
  public table="table";
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public listItems: Array<string> = ["Prix Carburant", "Prix Pneumatique", "Charge Entretien", "Indice Carburant"];
  public listType: Array<string> = ["Essence", "Diesel", "Gaz", "ELECTRIC"];
  showloader = false;
  allComplete: boolean = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];
  public canUpdateCapacity: boolean = false;


  constructor(
    private createFraisService: CreateFraisService,
    public dialogRef: MatDialogRef<DialogCreateUser>,
    private fb: FormBuilder,
    private router: Router,
    private pbi: PowerbiEmbeddedService) {
    super();

    this.signupForm = this.fb.group({
      code_carburant: new FormControl('', [Validators.required,]),
      prix: new FormControl('', [Validators.required,]),
      type_Carburant: new FormControl('', [Validators.nullValidator], ),
      type_Frais: new FormControl('', [Validators.required],),
      
    });

    this.code_carburant = this.signupForm.get('code_carburant');
    this.prix = this.signupForm.get('prix');
    this.type_Carburant = this.signupForm.get('type_Carburant');
    this.type_Frais = this.signupForm.get('type_Frais');

  }

  public ngOnInit() {
    this.pbi.getAllReports().subscribe(res => {
      this.rapports = res.value;
      this.rapports.shift();
      this.rapports.forEach(element => {
        element.selected = false;
      });
    })
    this.signupForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  toggleSelection(rapport) {
    rapport.selected = !rapport.selected;
    if (rapport.selected) {
      this.selectedRapports.push(rapport.id);
    } else {
      const i = this.selectedRapports.findIndex(
        value =>
          value.id === rapport.id
      );
      this.selectedRapports.splice(i, 1);
    }
    this.rapportControl.setValue('');
    console.log(this.selectedRapports);
  }
  public onInputChange(event) {
    event.target.required = true;
  }
  public checkCapacity(){
    this.canUpdateCapacity = !this.canUpdateCapacity;
  }
  public login() {
    this.error = null;
    const formData = new FormData();
    if (this.signupForm.get('type_Frais').value == "Prix Carburant"){
      formData.append('code_Carburant', this.signupForm.get('code_carburant').value);
      formData.append('type_Carburant', this.signupForm.get('type_Carburant').value);
      formData.append('prix_essence', this.signupForm.get('prix').value);
      formData.append('prix_Diesel', this.signupForm.get('prix').value);
      formData.append('prix_Gaz', this.signupForm.get('prix').value);
      formData.append('is_active', this.is_active.toString());
      formData.append('is_deleted', this.is_deleted.toString());
      this.table = "carburant";
    }else if(this.signupForm.get('type_Frais').value == "Prix Pneumatique")
    {
      formData.append('code_Pneumatique', this.signupForm.get('code_carburant').value);
      formData.append('prix_Pneumatique', this.signupForm.get('prix').value);
      this.table = "pnumatique";
    }else if(this.signupForm.get('type_Frais').value == "Charge Entretien")
    {
      formData.append('code_Entretien', this.signupForm.get('code_carburant').value);
      formData.append('prix_entretien', this.signupForm.get('prix').value);
      this.table = "entretien";
    }else if(this.signupForm.get('type_Frais').value == "Indice Carburant")
    {
      formData.append('code_IndiceCarburant', this.signupForm.get('code_carburant').value);
      formData.append('prix_IndiceCarburant', this.signupForm.get('prix').value);
      this.table = "IndiceCarburant";
    }
    if (this.signupForm.valid) {
      this.showloader = true;
      this.createFraisService.signup(formData, this.table)
        .subscribe(
          res => {
            this.showloader = false;
            this.dialogRef.close('submit');
          },
          error => {
            this.showloader = false;
            this.error = "Les donnees incorrect";
            console.log(error);
          });
    }
  }
  setAll(completed: boolean) {
    console.log(completed);
  }

}
export class User {
  id?: any;
  code_carburant?: string;
  prix?: any;
  type?: string;
  is_active?: string;
  rappo?: string;
  reports_id: string;
  canUpdateCapacity: boolean;
  last_login?: string;
  is_deleted?: boolean;
}
export class Carburant {
  id?: any;
  Code_Carburant?: string;
  code_Pneumatique?:string;
  code_Entretien?:string;
  code_IndiceCarburant?:string;
  Type_Carburant?: any;
  Type_Frais?:any;
  dateupdate?: string;
  prix_essence?: string;
  prix_Diesel?: string;
  prix_Gaz?: string;
  prix_IndiceCarburant?:string;
  prix_entretien?:string;
  prix_Pneumatique?:string;
  is_deleted?: boolean;
  is_active?: boolean;
}

@Component({
  templateUrl: './dialog-details-frais/details-frais.component.html',
  styleUrls: ['./dialog-details-frais/details-frais.component.scss']
})

export class DialogDetailsFrais extends UpgradableComponent {
  currentFrais: Carburant = {
    id:'',
    Code_Carburant: '',
    Type_Frais: '',
    Type_Carburant: '',
    prix_Diesel:'',
    prix_essence: '',
    prix_Gaz: '',
    is_deleted: false,
    dateupdate: '',
  };
  
  public updateForm: FormGroup;
  public id;
  public Code_Carburant;
  public prix_Diesel;
  public prix_essence; 
  public prix_Gaz;
  public Type_Carburant;
  public Type_Frais;
  public is_deleted;
  public dateupdate;
  public username;
  public prix;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string = "Admin";
  public activated: string = "Non actif";
  public canUpdateCapacity: boolean;
  public listItems: Array<string> = ["Prix Carburant", "Prix Pneumatique", "Charge Entretien", "Indice Carburant"];
  public listType: Array<string> = ["Essence", "Diesel", "Gaz"];
  showloader = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];

  constructor(
    private pbi: PowerbiEmbeddedService,
    private userService: DetailsUserService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogDetailsFrais>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super();

    this.Code_Carburant = this.currentFrais.Code_Carburant;
    this.Type_Frais = this.currentFrais.Type_Frais;
    this.Type_Carburant = this.currentFrais.Type_Carburant;
    this.is_deleted = this.getStatus(this.currentFrais.is_deleted);
    this.prix_Diesel = this.currentFrais.prix_Diesel;
    this.prix_essence = this.currentFrais.prix_essence;
    this.prix_Gaz = this.currentFrais.prix_Gaz;
    this.updateForm = this.fb.group({
      Code_Carburant: new FormControl('', [
        Validators.required,
      ]),
      prix: new FormControl('', [
        Validators.required,
      ]),
      Type_Carburant: new FormControl('', [
        Validators.pattern(this.Type_Carburant),
      ]),
      status: new FormControl(this.activated, [
        Validators.required,
      ])
    });
    this.Code_Carburant = this.updateForm.get('code_carburant');
    this.prix = this.updateForm.get('prix');
    this.Type_Carburant = this.updateForm.get('Type_Carburant');
    this.status = this.updateForm.get('status');

  }

  ngOnInit(): void {
    //this.getUser(this.data.currentUser.id);
    this.pbi.getAllReports().subscribe(res => {
      this.rapports = res.value;
      this.rapports.shift();
      this.rapports.forEach(element => {
        if (this.selectedRapports.includes(element.id)) {
          element.selected = true;

        } else {
          element.selected = false;
        }
      });
    })
  }

  public checkCapacity(){
    this.canUpdateCapacity = !this.canUpdateCapacity;
  }
  toggleSelection(rapport) {
    rapport.selected = !rapport.selected;
    if (rapport.selected) {
      this.selectedRapports.push(rapport.id);
    } else {
      const i = this.selectedRapports.findIndex(
        value =>
          value.id === rapport.id
      );
      this.selectedRapports.splice(i, 1);
    }
    this.rapportControl.setValue('');
    console.log(this.selectedRapports);
  }
  public getStatus(is_active) {
    if (is_active === true) {
      return "Actif";
    } else {
      return "Non actif";
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }

}

@Component({
  templateUrl: './dialog-delete-frais/delete-frais.component.html',
  styleUrls: ['./dialog-delete-frais/delete-frais.component.scss']
})
export class DialogDeleteUser extends UpgradableComponent {
  currentFrais: Carburant = {
    id:'',
    Code_Carburant: '',
    Type_Carburant: '',
    dateupdate: '',
    prix_essence: '',
    prix_Diesel: '',
    prix_Gaz: '',
    is_deleted: false,
    code_Pneumatique:'',
    code_Entretien:'',
    code_IndiceCarburant:'',
    Type_Frais:'',
    prix_IndiceCarburant:'',
    prix_entretien:'',
    prix_Pneumatique:'',

  };
  public updatetable: string;
  public updateForm: FormGroup;
  public code_Carburant;
  public prix_essence;
  public prix_Diesel;
  public prix;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string = "Admin";
  public activated: string = "Non actif";
  public canUpdateCapacity: boolean;
  public listItems: Array<string> = ["Prix Carburant", "Prix Pneumatique", "Charge Entretien", "Indice Carburant"];
  public listType: Array<string> = ["Essence", "Diesel", "Gaz"];
  showloader = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];

  constructor(
    private userService: DetailsUserService,
    public dialogRef: MatDialogRef<DialogDeleteUser>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super();
    this.currentFrais = Object.assign({},this.data.currentFrais);
    this.updatetable = this.data.updatetable.toString();
  }
  ngOnInit(): void {
  }
  deleteFrais(){
    this.currentFrais['is_deleted'] = true;
    this.showloader = true;
    this.userService.update(this.currentFrais.id, this.currentFrais, this.updatetable)
      .subscribe(
        response => {
          this.showloader = false;
          this.dialogRef.close('submit');
          this.openSnackBar("la viariable  est supprimé", "Ok",3500);
        });
  }
  cancel(){
    this.dialogRef.close();
  }
  openSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
