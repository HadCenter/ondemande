import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { DetailsTransactionService } from './details-transaction.service';
@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent implements OnInit {
  transaction:any={};

  constructor(private route: ActivatedRoute,
    public service: DetailsTransactionService,
   ) { }

  ngOnInit(): void {
   // this.transaction.transaction=this.route.snapshot.params.id;
    this.transaction=this.service.getTransactionById(this.route.snapshot.params.id);
    console.log(this.transaction)
  }

}




