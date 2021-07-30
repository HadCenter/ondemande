import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ImportFileEdiService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
   { }
   public getAllClients () : Observable<any> {
    return this.http.get(`${this.url}/getClients/`);
  }
  public uploadLogisticFile(formData) {
    console.log("web service");
    return this.http.post(`${this.url}/logisticFile/`, formData);
  }
}
