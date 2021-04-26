import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ListTransactionService {

  private url = `${environment.apiBaseUrl}/talendEsb`;
  constructor(private http: HttpClient) { }
  public getAllTransactions () : Observable<any> {
    return this.http.get(`${this.url}/getAllTransactionMadLivraison`);
  }
  public integrerTransaction(data) : Observable<any>{
    return this.http.post(`${this.url}/integrerMADFile`, data);
  }
  public getAdvancedHeaders() {
    return [
      {
        name: 'Date Début',
        sort: 0,

      },
      {
        name: 'Date fin',
        sort: 0,

      },
      {
        name: 'Statut',
        sort: null,

      },
      {
        name: 'Actions',
        sort: null,

      }

    ];
  }

}
