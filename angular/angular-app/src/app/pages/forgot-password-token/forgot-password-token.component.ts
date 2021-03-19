import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPasswordTokenService } from './forgot-password-token.service';
import { BlankLayoutCardComponent } from '../../components/blank-layout-card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-token',
  templateUrl: './forgot-password-token.component.html',
  styleUrls: ['../../components/blank-layout-card/blank-layout-card.component.scss']
})
export class ForgotPasswordTokenComponent extends BlankLayoutCardComponent implements OnInit {
  public tokenStatus = '';
  public token = '';
  public loginForm: FormGroup;
  public id;
  public password1;
  public password2;
  public error: string;

  constructor(private userPasswordService: ForgotPasswordTokenService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute,) {
      super();
      this.loginForm = this.fb.group({
      password1: new FormControl('', Validators.required),
      password2 : new FormControl('',Validators.required),
      });
      this.password1 = this.loginForm.get('password1');
      this.password2 = this.loginForm.get('password2');
      this.route.queryParams.subscribe(params =>{
        this.token = params.token;
      })
    }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });
    this.getTokenStatus();
  }
  public onInputChange(event)
  {
    event.target.required = true;
  }
  public getTokenStatus()
  {
//     const routeParams = this.route.snapshot.paramMap;
//     this.token = routeParams.get('token');
    var data = {};
    data['token'] = this.token;
    this.userPasswordService.getTokenStatus(data)
        .subscribe(res => this.tokenStatus = 'valide',
          error => this.tokenStatus = 'nonvalide');
  }
  public login()
  {
//     const routeParams = this.route.snapshot.paramMap;
//     this.token = routeParams.get('token');
    this.password1 = this.loginForm.getRawValue()['password1'];
    this.password2 = this.loginForm.getRawValue()['password2'];
    console.log(this.loginForm.getRawValue());
    var data = this.loginForm.getRawValue();
    data['token']= this.token;
    console.log(data);
    if (this.loginForm.valid) {
      this.userPasswordService.login(data)
        .subscribe(res => this.router.navigate(['/login']),
          error => this.error = "Les mots de passe ne correspondent pas");
    }
  }

}
