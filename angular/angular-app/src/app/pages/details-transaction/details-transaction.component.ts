import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradableComponent } from 'theme/components/upgradable';

@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent extends UpgradableComponent implements OnInit {
  transaction:any={};
  file: any;
  showWrong: boolean = true;
  showValid: boolean = true;

  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
    private _snackBar: MatSnackBar, private router: Router,) { super(); }

  ngOnInit(): void {
    this.transaction=this.service.getTransactionById(this.route.snapshot.params.id);
    //this.getFile(this.route.snapshot.params.id);
  }
  getFile(id: string) {
    this.service.get(id)
      .subscribe(
        data => {
          this.file = data;
          if (this.file.validatedOrders != '_') {
            this.getValidFile();
          }
          else {
            this.showValid = false;
          }
          if (this.file.wrongCommands != '_') {
            this.getWrongFile();
          }
          else {
            this.showWrong = false;
          }
        },
        error => {
          console.log(error);
        });
  }
  getValidFile()
  {
  }
  getWrongFile()
  {
  }


}




