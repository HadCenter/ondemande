import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigResponse } from './powerbi-embedded.component';

@Injectable({
  providedIn: 'root'
})
export class PowerbiEmbeddedService {

  constructor(private httpClient: HttpClient) {}

  /**
   * @returns embed configuration
   */
  getEmbedConfig(id: string): Observable<ConfigResponse> {
    // let params = new HttpParams();
    // params = params.append('id', id);

    return this.httpClient.get<ConfigResponse>(`http://localhost:8000/embededPowerBI/getSingleReport/`+id);
  }

}
