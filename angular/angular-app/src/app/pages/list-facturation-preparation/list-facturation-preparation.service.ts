import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListFacturationPreparationService {
  private url = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) { }

  public getClients () : Observable<any> {
    return this.http.get(`${this.url}/facturation/getListClient/`);
  }
  public getAdvancedHeaders() {
    return [
      {
        name: 'Nom Client',
        sort: 0,

      },
      {
        name: 'Code Client',
        sort: 0,

      },
      {
        name: 'Actions',
        sort: null,

      }

    ];
  }
}
