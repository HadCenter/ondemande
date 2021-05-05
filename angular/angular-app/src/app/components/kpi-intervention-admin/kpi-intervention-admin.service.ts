import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KpiInterventionAdminService {

  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }

  public getNumberOfInterventionsPerDateAll() : Observable<any> {
    return this.http.get(`${this.url}/getNumberOfInterventionsPerDateAll`);
  }

  public getNumberOfInterventionsWithFilters(data) : Observable<any> {
    return this.http.post(`${this.url}/getNumberOfInterventionsWithFilters`, data);
  }
}
