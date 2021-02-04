import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CreateClientService {
  private url = 'http://127.0.0.1:8000/api'
  constructor(private http: HttpClient)
  { }
  public login(data): Observable<any> {
    const body = {"code_client" : data.code, "nom_client" : data.nom, "email" : data.email}
    return this.http.post(`${this.url}/client/`, body);

  }

}
