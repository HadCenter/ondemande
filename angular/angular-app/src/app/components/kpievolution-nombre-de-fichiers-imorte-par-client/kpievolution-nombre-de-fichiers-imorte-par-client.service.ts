import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class KPIEvolutionNombreDeFichiersImorteParClientService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  public getNumberOfFilesPerClient () : Observable<any> {
    return this.http.get(`${this.url}/getNumberOfFilesPerClient/`);
  }
  public getAllFiles () : Observable<any> {
    return this.http.get(`${this.url}/getFiles/`);
  }
}