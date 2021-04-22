import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DetailsTransactionService {
  private url = `${environment.apiBaseUrl}/talendEsb`;
  constructor(private http: HttpClient) { }
  public getDetailTransaction (route_param_id) : Observable<any> {
    return this.http.get(`${this.url}/getSingleTransactionMadLivraison/${route_param_id}`);
  }

}
