import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Carburant } from '../frais.component';


@Injectable()
export class DetailsUserService {

  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
  { }
  get(id): Observable<any> {
    return this.http.get(`${this.url}/carburant/${id}`);
  }
  update(id, data, table): Observable<any> {
    if(table == 'Carburant')
    {
      return this.http.put(`${this.url}/carburant/${id}`, data);
    }else if (table == 'Entretien')
    {
      return this.http.put(`${this.url}/entretien/${id}`, data);
    }else if (table == 'Pneumatique')
    {
      return this.http.put(`${this.url}/pnumatique/${id}`, data);

    }else if (table == 'Indice')
    {
      return this.http.put(`${this.url}/IndiceCarburant/${id}`, data);

    }
    
  }
}
