import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class GenererTransactionService {
  private url = `${environment.apiBaseUrl}/talendEsb`;
  constructor(private http: HttpClient) { }
  public genererTransaction(data) : Observable<any>{
    return this.http.post(`${this.url}/genererMADFile`, data);
  }
}
