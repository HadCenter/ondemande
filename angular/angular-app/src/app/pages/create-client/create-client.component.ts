import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateClientService } from './create-client.service';
import { UpgradableComponent } from '../../../theme/components/upgradable';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent extends UpgradableComponent implements OnInit {
  public loginForm: FormGroup;
  public code;
  public nom;
  public email;
  public password;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public error: string;

  constructor(private authService: CreateClientService, private fb: FormBuilder, private router: Router)
  {
    super();
    this.loginForm = this.fb.group({
      code: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
        Validators.maxLength(25),
      ])
    });
    this.code = this.loginForm.get('code');
    this.nom = this.loginForm.get('nom');
    this.email = this.loginForm.get('email')

  }

  ngOnInit(): void
  {
    this.loginForm.valueChanges.subscribe(() => {
      this.error = null;
    });

  }
 public login() {
    this.error = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(res => this.router.navigate(['/list-client']),
          // error => this.error = "error.message");
          // for fake data
          err => this.error = "Le client déjà existe");
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }



}
