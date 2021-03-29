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
  currentClient: Client = {
    code_client: '',
    nom_client: '',
    email: ''
  };
  id: string;

  constructor(private clientService: DetailsClientService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute,) {
    super();
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getClient(this.id);
  }

  getClient(id: string): void {
    this.clientService.get(id)
      .subscribe(
        data => {
          this.currentClient = data;
        },
        error => {
          console.log(error);
        });
  }

}
