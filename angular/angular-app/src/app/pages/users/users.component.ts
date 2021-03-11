import { Component, OnInit,HostBinding, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpgradableComponent } from 'theme/components/upgradable';
import { CreateUserService } from './dialog/create-user.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends UpgradableComponent implements  OnInit  {
  limit = 15;
  @HostBinding('class.mdl-grid') private readonly mdlGrid = true;
  @HostBinding('class.mdl-cell') private readonly mdlCell = true;
  @HostBinding('class.mdl-cell--12-col-desktop') private readonly mdlCell12ColDesktop = true;
  @HostBinding('class.mdl-cell--12-col-tablet') private readonly mdlCell12ColTablet = true;
  @HostBinding('class.mdl-cell--4-col-phone') private readonly mdlCell4ColPhone = true;
  @HostBinding('class.mdl-cell--top') private readonly mdlCellTop = true;
  @HostBinding('class.ui-tables') private readonly uiTables = true;
  users = [];
  show = true;
  public advancedHeaders = this.usersService.getAdvancedHeaders();
  constructor(private usersService: UsersService,
    private matDialog: MatDialog,private router: Router,) {
    super();
  }

  ngOnInit(): void {
    this.getUsers ();
    console.log(this.users);
  }

  public getUsers ()
  {
    this.usersService.getAllUsers()
      .subscribe(res => {this.users = res; console.log(this.users);
      },
          // error => this.error = "error.message");
          // for fake data
          error => console.log(error));
  }
  public getProfile(is_superadmin)
  {
    if (is_superadmin)
    {
      return "SuperAdmin";
    }
    else{
      return "Admin";
    }
  }
  public getStatus(is_active)
  {
    if (is_active)
    {
      return "Actif";
    }else{
      return "Non actif";
    }
  }

  public actualiser() {
    this.users = [];
    this.show = true;
   // this.clients = [];
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

}

@Component({
  templateUrl: './dialog/create-user.component.html',
  styleUrls: ['./dialog/create-user.component.scss']
})
export class DialogCreateUser extends UpgradableComponent  {
  public signupForm: FormGroup;
  public email;
//   public password;
  public username;
  public name;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public listItems : Array<string> = ["Admin","SuperAdmin"];
  showloader = false;

//   public listObject : { id: string, label: string }[] = [];
  constructor(private createuserService: CreateUserService,
    public dialogRef: MatDialogRef<DialogCreateUser>,
    private fb: FormBuilder,
    private router: Router)
  {
   super();

    this.signupForm = this.fb.group({
//       password: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      username: new FormControl('', [Validators.required,]),
      name: new FormControl('', [Validators.required],),
    });
    this.email = this.signupForm.get('email');
//     this.password = this.signupForm.get('password');
    this.username = this.signupForm.get('username');
    this.name = this.signupForm.get('name');
//     this.dropdownRefresh();
   }

  public ngOnInit()
  {
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
//     formData.append('password', this.signupForm.get('password').value);
    formData.append('username', this.signupForm.get('username').value);
    var name = this.signupForm.getRawValue().name;
    if (name ==='SuperAdmin')
    {
      formData.append('is_superadmin', "true")
    }else
    {
      formData.append('is_admin', "true")
    }
//     formData.append('role', name);
//     console.log(name);
//     var role = this.listObject.find(element => element.label === name);
//     console.log(formData.get('email'));
//     console.log(formData.get('password'));
//     console.log(formData.get('username'));
//     console.log(formData.get('role'));
    if (this.signupForm.valid) {
      this.showloader = true;
      this.createuserService.signup(formData)
        .subscribe(
        res => {
          this.showloader = false;
          this.dialogRef.close('submit');
        },
        error => {this.error = "L'email est déja utilisé"; console.log(error);});
    }
  }
//   dropdownRefresh()
//   {
//     this.createuserService.getAllRoles().subscribe(
//       data => {
//           console.log(data);
//           data.forEach(element => {
//               this.listItems.push(element["label"]);
//               var id = element['id']; var nomClient = element['label'];
//               var client = {
//                   id : id,
//                   label : nomClient
//               };
//               this.listObject.push(client);
//           });
//           console.log(this.listItems);
//           console.log(this.listObject);
//
//       });
//   }

}

