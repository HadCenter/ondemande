import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/*';

import { BlankLayoutCardComponent } from '../../components/blank-layout-card';

@Component({
  selector: 'app-sign-up',
  styleUrls: ['../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './sign-up.component.html',
})
export class SignUpComponent extends BlankLayoutCardComponent implements OnInit {

  public signupForm: FormGroup;
  public email;
  public password;
  public username;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) {
    super();

    this.signupForm = this.fb.group({
      password: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
        Validators.maxLength(25),
      ]),
      username: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    });
    this.email = this.signupForm.get('email');
    this.password = this.signupForm.get('password');
    this.username = this.signupForm.get('username');
  }

  public ngOnInit() {
    this.authService.logout();
    this.signupForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public login() {
    this.error = null;
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.getRawValue())
        .subscribe(res => this.router.navigate(['/list-file-edi']),
          error => this.error = "L'email est déja utilisé");
    }
  }

  public onInputChange(event) {
    event.target.required = true;
  }
}
