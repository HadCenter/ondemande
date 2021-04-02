import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { UpgradableComponent } from 'theme/components/upgradable';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends UpgradableComponent implements OnInit
{
  constructor(public tablesService: HomeService, private router: Router,)
  { super();}

  ngOnInit(): void {
  }
}



