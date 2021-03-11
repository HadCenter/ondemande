import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsUserService } from './details-user.service';
import { UpgradableComponent } from '../../../theme/components/upgradable';
export class User {
    id?: any;
    username?: string;
    email?: string;
    is_active?: string;
    is_superadmin?: string;
    is_admin?: string;
    last_login?: string;
  }
@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.scss']
})
export class DetailsUserComponent extends UpgradableComponent implements OnInit {
currentUser : User = {
  username: '',
  email: '',
  is_active: '',
  is_superadmin: '',
  is_admin: '',
  last_login: ''
 };
  public updateForm: FormGroup;
  public username;
  public profile;
  public email;
  public status;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public role :string;
  public activated :string;
  public listItems : Array<string> = ["Admin","SuperAdmin"];
  constructor(private userService: DetailsUserService, private fb: FormBuilder, private router: Router,private route: ActivatedRoute,)
   {
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
  this.getUser(this.route.snapshot.params.id);

}
public getStatus(is_active)
{
  if(is_active === true)
  {
    return "Actif";
  }else{
    return "Non actif";
  }
}
public getRole(is_admin)
{
  console.log(is_admin);
  if(is_admin === true)
  {
    return "Admin";
  }else{
    return "SuperAdmin";
  }
}
 public onInputChange(event) {
    event.target.required = true;
  }
  updateUser(): void {
    console.log(this.currentUser);
    console.log(this.role);
    console.log(this.activated);
    if(this.activated === 'Active')
    {
      this.currentUser['is_active'] = 'true';
    }else
    {
      this.currentUser['is_active'] = 'false';
    }
    if(this.role === 'Admin')
    {
      this.currentUser['is_admin'] = 'true';
      this.currentUser['is_superadmin'] = 'false';
    }else
    {
      this.currentUser['is_admin'] = 'false';
      this.currentUser['is_superadmin'] = 'true';
    }

    console.log(this.currentUser);
    this.userService.update(this.currentUser.id, this.currentUser)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/users'])
        });
  }

  getUser(id: string): void {
    this.userService.get(id)
      .subscribe(
        data => {
          this.currentUser = data;
          this.role = this.getRole(this.currentUser.is_admin);
          this.activated = this.getStatus(this.currentUser.is_active);
          console.log(this.currentUser);
        },
        error => {
          console.log(error);
        });
  }

}
