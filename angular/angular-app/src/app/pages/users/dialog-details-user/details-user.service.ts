import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class DetailsUserService {

  private url = `${environment.apiBaseUrl}/api/auth`;
  constructor(private http: HttpClient)
  { }
  get(id): Observable<any> {
    return this.http.get(`${this.url}/getUser/${id}`);
  }
  update(id, data): Observable<any> {
    return this.http.put(`${this.url}/updateUser/${id}`, data);
  }
}
