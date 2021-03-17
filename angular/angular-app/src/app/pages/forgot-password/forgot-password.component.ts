import { Component, HostBinding } from '@angular/core';
import { BlankLayoutCardComponent } from '../../components/blank-layout-card';
import { OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  styleUrls: ['../../components/blank-layout-card/blank-layout-card.component.scss'],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent extends BlankLayoutCardComponent implements OnInit {
  public loginForm: FormGroup;
  public email;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;
  constructor(private authService: ForgotPasswordService, private fb: FormBuilder, private router: Router) {
    super();
    this.loginForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
    });
    this.email = this.loginForm.get('email');
  }
  public ngOnInit() {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }
  public login() {
    this.error = null;
    if (this.loginForm.valid) {
      console.log(this.loginForm.getRawValue());
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }
 }
