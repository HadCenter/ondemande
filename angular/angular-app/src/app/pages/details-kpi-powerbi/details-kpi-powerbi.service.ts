import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigResponse } from './details-kpi-powerbi.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsKpiPowerbiService {
  private url = `${environment.apiBaseUrl}/embededPowerBI`;

  constructor(private httpClient: HttpClient) { }

  getRapport(id: string): Observable<ConfigResponse> {

    return this.httpClient.get<ConfigResponse>(`${this.url}/getSingleReport/${id}`);
  }
}
