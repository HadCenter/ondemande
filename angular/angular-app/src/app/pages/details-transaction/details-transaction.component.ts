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
    this.getDetailTransaction(this.route.snapshot.params.id);
  }
  getDetailTransaction(route_param_id)
  {
    this.service.getDetailTransaction(route_param_id)
      .subscribe(
        data => {
        console.log(data);
        this.transaction = data;
        },
        error => {
          console.log(error);
        });

  }



}




