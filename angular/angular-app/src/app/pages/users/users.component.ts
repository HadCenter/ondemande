import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { DetailsUserService } from './dialog-details-user/details-user.service';
import { CreateUserService } from './dialog/create-user.service';
import { UsersService } from './users.service';

export interface DialogData {
  id: "0";
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
  show = true;
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  public filterValue: any;
  limit = 15;
  public getAdvancedTablePage(page, countPerPage) {
    return this.users.slice((page - 1) * countPerPage, page * countPerPage);
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
    this.advancedTable = this.filterItems(this.filterValue);
    if (this.filterValue === '') {
      this.advancedTable = this.advancedTable;
    }
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
        for(var i= 0; i < res.length; i++)
        {
          if(res[i].is_active == true)
          {
            res[i].status = "Actif"
          }else{
            res[i].status = "Non actif"
          }
        }
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

  openUpdateUser(id) {
    console.log("id,", id)
    const dialogRef = this.matDialog.open(DialogDetailsUser, {
      data: {
        id: id
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
  constructor(private createuserService: CreateUserService,
    public dialogRef: MatDialogRef<DialogCreateUser>,
    private fb: FormBuilder,
    private router: Router) {
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
    this.signupForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }
  public onInputChange(event) {
    event.target.required = true;
  }
  public login() {
    this.error = null;
    const formData = new FormData();
    formData.append('email', this.signupForm.get('email').value);
    formData.append('username', this.signupForm.get('username').value);
    formData.append('role', this.signupForm.get('role').value);
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
            this.error = "L'email est déja utilisé"; console.log(error); });
    }
  }
}

export class User {
  id?: any;
  username?: string;
  email?: string;
  is_active?: string;
  role?: string;
  last_login?: string;
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
    role : '',
    last_login: ''
  };
  public updateForm: FormGroup;
  public username;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role: string;
  public activated: string;
  public listItems: Array<string> = ["Admin", "SuperAdmin"];
  showloader = false;
  constructor(private userService: DetailsUserService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute,
    public dialogRef: MatDialogRef<DialogDetailsUser>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    super();
    this.updateForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.pattern(this.emailPattern),
      ]),
      profile: new FormControl('', [
        Validators.required,
      ]),
      status: new FormControl('', [
        Validators.required,
      ])
    });
    this.username = this.updateForm.get('username');
    this.email = this.updateForm.get('email');
    this.profile = this.updateForm.get('profile');
    this.status = this.updateForm.get('status');

  }

  ngOnInit(): void {
    this.getUser(this.data.id);

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
    console.log(this.currentUser);
    this.showloader = true;
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          this.showloader = false;
          this.dialogRef.close('submit');
        });

  }

  getUser(id: string): void {
    this.userService.get(id)
      .subscribe(
        data => {
          this.currentUser = data;
          this.role = this.currentUser.role;
          this.activated = this.getStatus(this.currentUser.is_active);
        },
        error => {
          console.log(error);
        });
  }

}

