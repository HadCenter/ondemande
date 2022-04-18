import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacturationPreparationService } from '../facturation-preparation/facturation-preparation.service';

@Component({
  selector: 'app-details-facture',
  templateUrl: './details-facture.component.html',
  styleUrls: ['./details-facture.component.scss']
})
export class DetailsFactureComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private service: FacturationPreparationService) { }

  public advancedHeaders: any = [];
  factures: any = [];
  acturationPerPagination: any = [];
  public currentPage = 1;
  private countPerPage = 8;
  public numPage = 0;
  public advancedTable = [];
  show = true;
  public moisFacture: any;
  public mois: any;
  public client: any;
  public client_name:string="";
  public readonly sortOrder = {
    asc: 1,
    desc: -1,
  };

  ngOnInit(): void {
    this.moisFacture = this.route.snapshot.params.facture;
    this.client = this.route.snapshot.params.client;
    var date = this.moisFacture.split('-');
    this.mois = new Date(parseInt(date[1]), parseInt(date[0])-1 , 1).toLocaleString('default', { month: 'long' }).toLocaleUpperCase();
    this.client_name = this.service.getClient();


    var data = {
      "code_client": this.client,
      "mois": this.moisFacture
    }
    this.service.getFacturationForClients(data).subscribe(res => {
      this.advancedTable = res;
      this.advancedHeaders = Object.keys(this.advancedTable[0]);
    },
      error => console.log(error));
  }


}
