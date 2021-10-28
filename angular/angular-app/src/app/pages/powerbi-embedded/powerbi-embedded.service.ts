import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PowerbiEmbeddedService {
  private url = `${environment.apiBaseUrl}/embededPowerBI`;

  constructor(private httpClient: HttpClient) {}

  getAllReports(): Observable<any> {

    return this.httpClient.get<any>(`${this.url}/getAllReports`);
  }
  resumeCapacity(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/resume`);
  }

  suspendCapacity(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/suspend`);
  }

  getCapacityState(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/getCapacityState`);
  }

  refreshDataset(id : string): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/refreshReport/${id}`,{});
  }

  getDatasetState(id : string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/getRefreshState/${id}`);
  }

  public getAdvancedHeaders() {
    return [
        {
            name: 'Nom du rapport',

        },
        {
            name: 'Type',

        },
        // {
        //     name: 'Dernière actualisation',

        // },
        // {
        //     name: 'Statut',

        // },
        {
            name : 'Actions'
        }
    ];
  }
}
