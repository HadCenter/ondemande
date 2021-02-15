import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsClientService } from './details-client.service';
import { MatSliderModule } from '@angular/material/slider';
import { UpgradableComponent } from '../../../theme/components/upgradable';

export class Client {
  id?: any;
  code_client?: string;
  nom_client?: string;
  email?: string;
}
@Component({
  selector: 'app-details-client',
  templateUrl: './details-client.component.html',
  styleUrls: ['./details-client.component.scss']
})
export class DetailsClientComponent extends UpgradableComponent implements OnInit {
  currentClient : Client = {
    code_client: '',
    nom_client: '',
    email: ''
  };
  message = '';
  public updateForm: FormGroup;
  public code;
  public nom;
  public email;
  public password;
  public emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  public codePattern = '^c[0-9]{3}$';
  public nomPattern = '[A-Z]+';
  public error: string;
  constructor(private clientService: DetailsClientService, private fb: FormBuilder, private router: Router,private route: ActivatedRoute,)
   {
    super();
    this.updateForm = this.fb.group({
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(this.codePattern),
      ]),
      nom: new FormControl('', [
        Validators.required,
        Validators.pattern(this.nomPattern),
      ]),
      email: new FormControl('', [
        Validators.pattern(this.emailPattern),
        Validators.maxLength(25),
      ])
    });
    this.code = this.updateForm.get('code');
    this.nom = this.updateForm.get('nom');
    this.email = this.updateForm.get('email')
   }

  ngOnInit(): void {
    this.getClient(this.route.snapshot.params.id);
  }
   public onInputChange(event) {
    event.target.required = true;
  }
  updateClient(): void {
    this.error = null;
    this.clientService.update(this.currentClient.id, this.currentClient)
      .subscribe(
        response => {
          console.log(response);
          this.message = "mise à jour réussie !"
          this.router.navigate(['/list-client'])
        },
        error => {
          this.error = "Le client déjà existe";
        });
  }

  getClient(id: string): void {
    this.clientService.get(id)
      .subscribe(
        data => {
          this.currentClient = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }



}
