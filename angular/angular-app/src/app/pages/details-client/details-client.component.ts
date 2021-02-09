import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsClientService } from './details-client.service';
import { MatSliderModule } from '@angular/material/slider';
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
export class DetailsClientComponent implements OnInit {
  currentClient : Client = {
    code_client: '',
    nom_client: '',
    email: ''
  };
  message = '';
  constructor(private clientService: DetailsClientService, private fb: FormBuilder, private router: Router,private route: ActivatedRoute,)
   { }

  ngOnInit(): void {
    this.getClient(this.route.snapshot.params.id);

  }
   public onInputChange(event) {
    event.target.required = true;
  }
  updateClient(): void {
    this.clientService.update(this.currentClient.id, this.currentClient)
      .subscribe(
        response => {
          console.log(response);
          this.message = "mise à jour réussie !"
          this.router.navigate(['/list-client'])
        },
        error => {
          console.log(error);
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
