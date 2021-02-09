import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ImportFileEdiService {
//   private url = 'http://127.0.0.1:8000/api'
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
   { }
   public getAllClients () : Observable<any> {
    return this.http.get(`${this.url}/getClients/`);
  }
  public upload(formData) {
    return this.http.post(`${this.url}/file/`, formData);
  }
}
