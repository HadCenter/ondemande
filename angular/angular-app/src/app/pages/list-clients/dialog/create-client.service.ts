import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CreateClientService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
  { }
  public login(data): Observable<any> {
    const body = {"code_client" : data.code, "nom_client" : data.nom, "email" : data.email}
    return this.http.post(`${this.url}/client/`, body);
  }


}
