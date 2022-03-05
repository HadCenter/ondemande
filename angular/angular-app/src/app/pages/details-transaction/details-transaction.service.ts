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

public seeAllFileTransaction (data): Observable<any> {
  return  this.http.post(`${this.url2}/seeAllFileContentMADFile`,data);
}

public correctAllFiles(data): Observable<any> {
  return  this.http.post(`${this.url1}/correctAllFiles`,data);
}
public correctMadFile(data): Observable<any> {
  return  this.http.post(`${this.url1}/correctMADFile`,data);
}
public correctMetaDataFile(data): Observable<any> {
  return  this.http.post(`${this.url1}/correctMetadataFile`,data);
}
public correctExceptionFile(data): Observable<any> {
  return  this.http.post(`${this.url1}/correctExceptionFile`,data);
}
public correctLivraisonFile(data): Observable<any> {
  return  this.http.post(`${this.url1}/correctLivraisonFile`,data);
}
public getAllTransactions(): Observable<any> {
  return this.http.get(`${this.url1}/getAllTransactionMadLivraison`);
}

public importLivraisonFile(data): Observable<any> {
  return this.http.post(`${this.url1}/downloadLivraisonFile`,data, { responseType: "blob" });
}

}
