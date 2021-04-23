import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class KpiAnomaliesService {

  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  
  public getAllAnomalies() : Observable<any> {
    return this.http.get(`${this.url}/kpi3/`);
  }
  public getNumberOfAnomaliesPerDateAll() : Observable<any> {
    return this.http.get(`${this.url}/getNumberOfAnomaliesPerDateAll`);
  }
  public getNumberOfAnomaliesPerIdAll() : Observable<any> {
    return this.http.get(`${this.url}/getNumberOfAnomaliesPerIdAll`);
  }
  
  public getAnomaliesByDate(date) : Observable<any> {
    return this.http.post(`${this.url}/getNumberOfAnomaliesPerDate`, date);
  }

  public getNumberOfAnomaliesWithFilters(data) : Observable<any> {
    return this.http.post(`${this.url}/getNumberOfAnomaliesWithFilters`, data);
  }

}
