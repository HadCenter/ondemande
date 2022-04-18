import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddFactureService {

  private url = `${environment.apiBaseUrl}/facturation`;
  constructor(private http: HttpClient) { }


  public addFacturation (data) : Observable<any> {
    return this.http.post(`${this.url}/addFacturation/`, data);
  }

  public getAdvancedHeaders() {
    return [
      // {
      //   name: 'Jour',
      //   sort: 0,

      // },
      {
        name: 'IDF Jour',
        sort: 0,

      },
      // {
      //   name: 'UM IDF Jour',
      //   sort: 0,

      // },
      {
        name: 'IDF Nuit',
        sort: 0,

      },
      // {
      //   name: 'UM IDF Nuit',
      //   sort: 0,

      // },
      {
        name: 'IDF Province',
        sort: 0,

      },
      // {
      //   name: 'UM IDF Province',
      //   sort: 0,

      // }
    ];
  }
}
