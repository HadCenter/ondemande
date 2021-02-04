import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateClientService } from './create-client.service';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {
  public loginForm: FormGroup;
  public code;
  public nom;
  public email;
  public password;
  public error: string;

  constructor(private authService: CreateClientService, private fb: FormBuilder, private router: Router)
  {

    this.loginForm = this.fb.group({
      code: new FormControl(''),
      nom: new FormControl(''),
      email: new FormControl('')
    });
    this.code = this.loginForm.get('code');
    this.nom = this.loginForm.get('nom');
    this.email = this.loginForm.get('email')

  }

  ngOnInit(): void {
  componentHandler.upgradeDom();
  }
 public login() {
    this.error = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.getRawValue())
        .subscribe(res => this.router.navigate(['/list-client']),
          // error => this.error = "error.message");
          // for fake data
          error => console.log("erreur"));
    }
  }
  public onInputChange(event) {
    event.target.required = true;
  }



}
