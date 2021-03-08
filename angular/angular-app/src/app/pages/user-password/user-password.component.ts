import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPasswordService } from './user-password.service';
import { BlankLayoutCardComponent } from '../../components/blank-layout-card';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['../../components/blank-layout-card/blank-layout-card.component.scss']
})
export class UserPasswordComponent extends BlankLayoutCardComponent implements OnInit {
  public loginForm: FormGroup;
  public id;
  public password1;
  public password2;
  public error: string;
  constructor(private userPasswordService: UserPasswordService,
    private fb: FormBuilder,
    private router: Router, private route: ActivatedRoute,) {
      super();
      this.loginForm = this.fb.group({
      password1: new FormControl('', Validators.required),
      password2 : new FormControl('',Validators.required),
    });
    this.password1 = this.loginForm.get('password1');
    this.password2 = this.loginForm.get('password2');
    }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });
  }

  public onInputChange(event)
  {
    event.target.required = true;
  }

  public login()
  {
    const routeParams = this.route.snapshot.paramMap;
    this.id = Number(routeParams.get('id'));
    console.log(this.loginForm.getRawValue());
    console.log(this.id);
  }
}
