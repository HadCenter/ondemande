import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CreateUserService {

  private url = `${environment.apiBaseUrl}/api/auth`;
  constructor(private http: HttpClient)
  { }
  public signup(data) : Observable<any>{
    return this.http.post(`${this.url}/register/`, data);
  }
}
