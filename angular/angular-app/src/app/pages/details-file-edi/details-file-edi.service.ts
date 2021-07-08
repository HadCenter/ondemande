import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DetailsFileEdiService {
  private url = `${environment.apiBaseUrl}/api`;
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
  public deleteFileEDI (data) : Observable<any> {
    return this.http.post(`${this.url}/deleteFileEDI/`, data);
  }

  public corretFile (data): Observable<any> {
    return  this.http.post(`${this.url}/DoInterventionAsAdminForEdiFileAndCorrectFile/`,data);
  }
  public updateFile (data): Observable<any> {
    return  this.http.post(`${this.url}/DoInterventionAsAdminForEdiFileAndChangeFile/`,data);
  }

  public sendFileToUrbantz(data): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/urbantzEsb/SendFromFileToUrbantzAsTasks/`,data);
  }

}