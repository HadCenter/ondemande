import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigJourFerieService {

  private url = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient) { }

  public getHolidays(): Observable<any> {
    return this.http.get(`${this.url}/facturation/getHolidays/`);
  }
  public updateHolidays(data): Observable<any> {
    return this.http.post(`${this.url}/facturation/updateHolidays/`, data);
  }}
