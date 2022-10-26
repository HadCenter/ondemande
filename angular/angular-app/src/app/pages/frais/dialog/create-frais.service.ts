import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CreateFraisService {

  private url = `${environment.apiBaseUrl}/api`;
  private table;
  constructor(private http: HttpClient)
  { }
  public signup(data, table) : Observable<any>{
    this.table = table;
    return this.http.post(`${this.url}/${this.table}`, data);
  }
}
