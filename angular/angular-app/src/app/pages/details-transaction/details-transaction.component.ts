import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-details-transaction',
  templateUrl: './details-transaction.component.html',
  styleUrls: ['./details-transaction.component.scss']
})
export class DetailsTransactionComponent implements OnInit {
  transaction:any={};

  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.transaction.transaction=this.route.snapshot.params.id;
  }

}
