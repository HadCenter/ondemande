import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigCritereService {
  private url = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) { }

  public getMatricePerClient(data): Observable<any> {
    return this.http.post(`${this.url}/facturation/getMatricePerClient/`, data);
  }
  public updateAllMatrice(data): Observable<any> {
    return this.http.post(`${this.url}/facturation/updateAllMatriceV2/`, data);
  }
}
