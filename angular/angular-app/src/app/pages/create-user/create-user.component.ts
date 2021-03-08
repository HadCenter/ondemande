import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserService } from './create-user.service';
import { UpgradableComponent } from '../../../theme/components/upgradable';
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent extends UpgradableComponent implements OnInit  {
  public signupForm: FormGroup;
  public email;
//   public password;
  public username;
  public name;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  public listItems : Array<string> = ["Admin","SuperAdmin"];
//   public listObject : { id: string, label: string }[] = [];
  constructor(private createuserService: CreateUserService,
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
      this.createuserService.signup(formData)
        .subscribe(
        res => this.router.navigate(['/users']),
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
