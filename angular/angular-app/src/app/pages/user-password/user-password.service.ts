import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserPasswordService {

  private url = `${environment.apiBaseUrl}/api/auth`;
  constructor(private http: HttpClient) { }


  public login(data): Observable<any> {
    return this.http.put(`${this.url}/updatePasswordUser/`, data);
  }
  public getTokenStatus(data): Observable<any> {
    return this.http.post(`${this.url}/getTokenStatus/`, data);
  }
}
