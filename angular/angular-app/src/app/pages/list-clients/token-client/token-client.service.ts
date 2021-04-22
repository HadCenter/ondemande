import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TokenClientService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  getClient(id): Observable<any> {
    return this.http.get(`${this.url}/getClient/${id}`);
  }
  updateClientToken(id, data): Observable<any> {
    return this.http.put(`${this.url}/updateClient/${id}`, data);
  }
}
