import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturationPreparationService {

  private url = `${environment.apiBaseUrl}/facturation`;
  public client: string = "";
  constructor(private http: HttpClient) { }

  public getFacturationForClients(data): Observable<any> {
    return this.http.post(`${this.url}/getFacturationForClient/`, data);
  }
  public getMonthListFacturationForClient(data): Observable<any> {
    return this.http.post(`${this.url}/getMonthFacturationWithTotal/`, data);
  }
  public downloadFacturationFile(data): Observable<any> {
    return this.http.post(`${this.url}/downloadFacturationPreparation/`, data, { responseType: "blob" });
  }
  public setClient(client_name) {
    this.client = client_name;
  }

  public getClient() {
    return this.client;
  }

  public getAdvancedHeaders() {
    return [
      {
        name: 'Mois',
        sort: 0,

      },
      {
        name: 'Total du mois',
        sort: 0,

      },
      {
        name: 'Actions',
        sort: null,

      }

    ];
  }

  public getAdvancedTable() {
    return [
      {
        month: 'Jan 2022',
        sort: 0,

      },
      {
        month: 'Fev 2022',
        sort: 0,

      },
    ];
  }

}
