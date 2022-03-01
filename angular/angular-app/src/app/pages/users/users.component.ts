import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { PowerbiEmbeddedService } from '../powerbi-embedded/powerbi-embedded.service';
import { DetailsUserService } from './dialog-details-user/details-user.service';
import { CreateUserService } from './dialog/create-user.service';
import { UsersService } from './users.service';

export interface DialogData {
  currentUser: User;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends UpgradableComponent implements OnInit {
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  users = [];
  copyUsersPerPagination = [];
  show = true;
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public filterValue: any;
  limit = 15;
  public getAdvancedTablePage(page, countPerPage) {
    return this.copyUsersPerPagination.slice((page - 1) * countPerPage, page * countPerPage);
  }
  public advancedHeaders = this.usersService.getAdvancedHeaders();
  constructor(private usersService: UsersService,
    private matDialog: MatDialog, private router: Router,) {
    super();
  }

  ngOnInit(): void {
    this.getUsers();
  }
  public changePage(page, force = false) {
    if (page !== this.currentPage || force) {
      this.currentPage = page;
      this.advancedTable = this.getAdvancedTablePage(page, this.countPerPage);
    }
  }
  setFilteredItems() {
    this.copyUsersPerPagination = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
    this.currentPage = this.copyUsersPerPagination.length > 0 ? 1 : 0;
    this.numPage = Math.ceil(this.copyUsersPerPagination.length / this.countPerPage);
    this.advancedTable = this.copyUsersPerPagination.slice(0, this.countPerPage);
  }
  filterItems(filterValue) {
    return this.users.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
    });
  }

  public getUsers() {
    this.usersService.getAllUsers()
      .subscribe(res => {
        this.users = res;
        for (var i = 0; i < res.length; i++) {
          if (res[i].is_active == true) {
            res[i].status = "Actif"
          } else {
            res[i].status = "Non actif"
          }
        }
        this.copyUsersPerPagination = this.users;
        this.numPage = Math.ceil(res.length / this.countPerPage); this.show = false;
        this.advancedTable = this.getAdvancedTablePage(1, this.countPerPage);
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
    this.advancedTable = [];
    this.users = [];
    this.show = true;
    this.getUsers();
  }

  openAddUser() {
    const dialogRef = this.matDialog.open(DialogCreateUser);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }

    });
  }

  openUpdateUser(user) {
    const dialogRef = this.matDialog.open(DialogDetailsUser, {
      data: {
        currentUser: user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });
  }

  openDeleteUser(user) {
    const dialogRef = this.matDialog.open(DialogDeleteUser, {
      data: {
        currentUser: user
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.actualiser();
      }
    });
  }
}


@Component({
  templateUrl: './dialog/create-user.component.html',
  styleUrls: ['./dialog/create-user.component.scss']
})
export class DialogCreateUser extends UpgradableComponent {
  public signupForm: FormGroup;
  public email;
  public username;
  public role;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public listItems: Array<string> = ["Admin", "SuperAdmin"];
  showloader = false;
  allComplete: boolean = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];
  public canUpdateCapacity: boolean = false;


  constructor(private createuserService: CreateUserService,
    public dialogRef: MatDialogRef<DialogCreateUser>,
    private fb: FormBuilder,
    private router: Router,
    private pbi: PowerbiEmbeddedService) {
    super();

    this.signupForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      username: new FormControl('', [Validators.required,]),
      role: new FormControl('', [Validators.required],),
    });
    this.email = this.signupForm.get('email');
    this.username = this.signupForm.get('username');
    this.role = this.signupForm.get('role');
  }

  public ngOnInit() {
    this.pbi.getAllReports().subscribe(res => {
      this.rapports = res.value;
      this.rapports.shift();
      this.rapports.forEach(element => {
        element.selected = false;
      });
      console.log(this.rapports);
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
    //this.selectedClientsNames = this.selectedClients.map(client => client.clientName);
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
    formData.append('email', this.signupForm.get('email').value);
    formData.append('username', this.signupForm.get('username').value);
    formData.append('role', this.signupForm.get('role').value);
    formData.append('reports_id', this.selectedRapports.toString());
    formData.append('canUpdateCapacity', this.canUpdateCapacity.toString());

    if (this.signupForm.valid) {
      this.showloader = true;
      this.createuserService.signup(formData)
        .subscribe(
          res => {
            this.showloader = false;
            this.dialogRef.close('submit');
          },
          error => {
            this.showloader = false;
            this.error = "L'email est déja utilisé"; console.log(error);
          });
    }
  }
  setAll(completed: boolean) {
    console.log(completed);
  }

}

export class User {
  id?: any;
  username?: string;
  email?: string;
  is_active?: string;
  role?: string;
  reports_id: string;
  canUpdateCapacity: boolean;
  last_login?: string;
  is_deleted?: boolean;
}

@Component({
  templateUrl: './dialog-details-user/details-user.component.html',
  styleUrls: ['./dialog-details-user/details-user.component.scss']
})
export class DialogDetailsUser extends UpgradableComponent {
  currentUser: User = {
    username: '',
    email: '',
    is_active: '',
    role: '',
    reports_id: '',
    canUpdateCapacity: false,
    last_login: '',
    is_deleted : false,
  };
  public updateForm: FormGroup;
  public username;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string = "Admin";
  public activated: string = "Non actif";
  public canUpdateCapacity: boolean;
  public listItems: Array<string> = ["Admin", "SuperAdmin"];
  showloader = false;
  rapportControl = new FormControl();
  selectedRapports = new Array<any>();
  public rapports = [];

  constructor(
    private pbi: PowerbiEmbeddedService,
    private userService: DetailsUserService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogDetailsUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super();
    this.currentUser = Object.assign({},this.data.currentUser);;
    this.role = this.currentUser.role;
    this.activated = this.getStatus(this.currentUser.is_active);
    if (this.currentUser.reports_id) {
      this.selectedRapports = this.currentUser.reports_id.split(',');
    }
    this.canUpdateCapacity = this.currentUser.canUpdateCapacity;
    this.updateForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.pattern(this.emailPattern),
      ]),
      profile: new FormControl(this.role, [
        Validators.required,
      ]),
      status: new FormControl(this.activated, [
        Validators.required,
      ])
    });
    this.username = this.updateForm.get('username');
    this.email = this.updateForm.get('email');
    this.profile = this.updateForm.get('profile');
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
    //this.selectedClientsNames = this.selectedClients.map(client => client.clientName);
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
  updateUser(): void {
    if (this.activated === 'Actif') {
      this.currentUser['is_active'] = 'true';
    } else {
      this.currentUser['is_active'] = 'false';
    }
    this.currentUser['role'] = this.role;
    this.currentUser['reports_id'] = this.selectedRapports.toString();
    this.currentUser['canUpdateCapacity'] = this.canUpdateCapacity;
    this.showloader = true;
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          this.showloader = false;
          this.dialogRef.close('submit');
          if(JSON.parse(localStorage.getItem('currentUser')).id == this.currentUser.id){
            localStorage.setItem('currentUser',JSON.stringify(this.currentUser));
          }
        });

  }

  getUser(id: string): void {
    this.userService.get(id)
      .subscribe(
        data => {
          this.currentUser = data;
          this.role = this.currentUser.role;
          this.activated = this.getStatus(this.currentUser.is_active);
          this.selectedRapports = this.currentUser.reports_id.split(',');
        },
        error => {
          console.log(error);
        });
  }

}

@Component({
  templateUrl: './dialog-delete-user/delete-user.component.html',
  styleUrls: ['./dialog-delete-user/delete-user.component.scss']
})
export class DialogDeleteUser extends UpgradableComponent {
  currentUser: User = {
    username: '',
    email: '',
    is_active: '',
    role: '',
    reports_id: '',
    canUpdateCapacity: false,
    last_login: '',
    is_deleted: false,
  };
  public updateForm: FormGroup;
  public username;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string = "Admin";
  public activated: string = "Non actif";
  public canUpdateCapacity: boolean;
  public listItems: Array<string> = ["Admin", "SuperAdmin"];
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
    this.currentUser = Object.assign({},this.data.currentUser);
    console.log(this.currentUser);
  }

  ngOnInit(): void {

  }


  deleteUser(){
    this.currentUser['is_deleted'] = true;
    this.showloader = true;
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          this.showloader = false;
          this.dialogRef.close('submit');
          this.openSnackBar("l'utilisateur est supprimé", "Ok",3500);
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
