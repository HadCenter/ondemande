import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DetailsTransactionService {
  private url1 = `${environment.apiBaseUrl}/talendEsb`;
  private url2 = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  public getDetailTransaction (route_param_id) : Observable<any> {
    return this.http.get(`${this.url1}/getSingleTransactionMadLivraison/${route_param_id}`);
  }
  public seeFileContent(data) : Observable<any> {
    return this.http.post(`${this.url2}/seeFileContentMADFile`, data);
  }


}
