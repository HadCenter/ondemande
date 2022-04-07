import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DetailsFileMagistorService {
  private url = `${environment.apiBaseUrl}/api`;
  private url2= `${environment.apiBaseUrl}/talendEsb`;
  constructor(private http: HttpClient) { }
  getFile(id): Observable<any> {
    return this.http.get(`${this.url}/getLogisticFile/${id}`);
  }
  getLogisticFileContent(data): Observable<any> {
    return this.http.post(`${this.url}/seeLogisticFileContent`, data);
  }
  public corretFile (data): Observable<any> {
    return  this.http.post(`${this.url2}/startEngineOnMagistorFiles`,data);
  }
  public correctLogisticFile (data): Observable<any> {
    return  this.http.post(`${this.url}/createLogisticFile`,data);
  }
  public correctAndValidateLogisticFile (data): Observable<any> {
    return  this.http.post(`${this.url}/createLogisticFileAndValidateFile`,data);
  }

}
