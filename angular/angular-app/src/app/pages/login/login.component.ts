import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/*';
import { BlankLayoutCardComponent } from '../../components/blank-layout-card';
@Component({
  selector: 'app-login',
  styleUrls: ['../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './login.component.html',
})
export class LoginComponent extends BlankLayoutCardComponent implements OnInit {
  public loginForm: FormGroup;
  public email;
  public password;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    super();
    if (localStorage.getItem('currentUser')) {
      this.router.navigate(['/home']);
    }
    else {
      this.loginForm = this.fb.group({
        password: new FormControl('', Validators.required),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern(this.emailPattern),

        ]),
      });
      this.email = this.loginForm.get('email');
      this.password = this.loginForm.get('password');
    }


  }

  public ngOnInit() {
    this.authService.logout();
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public login() {
    this.error = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(res => this.router.navigate(['/home']),
          error => {
            this.error = error.error.message;
            if(this.error === undefined){
              this.error = "Le mot de passe est incorrect";
            }
          });
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }
}
