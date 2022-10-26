import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()

export class fraisService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  
  public getAllFrais () : Observable<any> {
    return this.http.get(`${this.url}/carburant`);
  }
  public getAllPneumatique () : Observable<any> {
    return this.http.get(`${this.url}/pnumatique`);
  }
  public getAllEntretien () : Observable<any> {
    return this.http.get(`${this.url}/entretien`);
  }
  public getAllIndice () : Observable<any> {
    return this.http.get(`${this.url}/IndiceCarburant`);
  }
  public getCarburantHeaders() {
    return [
        {
            name: 'Code Carburant',

        },
        {
            name: 'Type Carburant',

        },
        {
            name: 'Date UP',

        },
        {
            name: 'Prix',

        },
    ];
  }
  public getPneumatiqueHeaders() {
    return [
        {
            name: 'Code Pneumatique',

        },
        {
            name: 'Type Carburant',

        },
        {
            name: 'Date UP',

        },
        {
            name: 'Prix',

        },
    ];
  }
  public getEntretienHeaders() {
    return [
        {
            name: 'Code Entretien',

        },
        {
            name: 'Type Carburant',

        },
        {
            name: 'Date UP',

        },
        {
            name: 'Prix',

        },
    ];
  }
  public getIndiceHeaders() {
    return [
        {
            name: 'Code Carburant',

        },
        {
            name: 'Type Carburant',

        },
        {
            name: 'Date UP',

        },
        {
            name: 'Prix',

        },
    ];
  }
}
