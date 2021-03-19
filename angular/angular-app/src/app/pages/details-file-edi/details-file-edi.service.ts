import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DetailsFileEdiService {
  private url = `${environment.apiBaseUrl}/api`;
//   private url = 'http://127.0.0.1:8000/api'
  constructor(private http: HttpClient) { }
  get(id): Observable<any> {
    return this.http.get(`${this.url}/getFile/${id}`);
  }

  public uploadFileOutput (clientName, fileName) : Observable<any> {

    return this.http.get(`${this.url}/uploadFileOutput/${clientName}/${fileName}/`, { responseType: "blob" });
  }
  public uploadFileInput (clientName, fileName) : Observable<any> {

    return this.http.get(`${this.url}/uploadfile/${clientName}/${fileName}/`, { responseType: "blob" });
  }

  public getFileEdi (data) : Observable<any> {

    return this.http.post(`${this.url}/seeFileContent`, data);
  }
}
