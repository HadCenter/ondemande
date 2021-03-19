import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private url = `${environment.apiBaseUrl}/api/auth`;
  constructor(private http: HttpClient) { }
  public login(data): Observable<any> {
    return this.http.post(`${this.url}/forgetPassword/`, data);
  }
}
