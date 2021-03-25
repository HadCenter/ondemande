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
export class HomeComponent extends UpgradableComponent implements OnInit {
  files =[];
  constructor(public tablesService: HomeService, private router: Router,)
  { super();}

  ngOnInit(): void {
//     this.getData();
  }
   public getData() {
    this.tablesService.getNumberOfFilesPerClient()
      .subscribe(res => {
        this.files = res;
        console.log('files',this.files)
      },
        error => console.log(error));
  }

}
