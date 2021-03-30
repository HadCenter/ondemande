import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class DetailsClientService {
  private url = `${environment.apiBaseUrl}/api`;
//   private url = 'http://127.0.0.1:8000/api'
  constructor(private http: HttpClient) { }
  get(id): Observable<any> {
    return this.http.get(`${this.url}/getClient/${id}`);
  }
  update(id, data): Observable<any> {
    return this.http.put(`${this.url}/updateClient/${id}`, data);
  }
}
