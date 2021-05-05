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
  // public seeFileContent(data) : Observable<any> {
  //   return this.http.post(`${this.url2}/seeFileContentMADFile`, data);
  // }
//   public getDetailTransactionSynchrone(route_param_id)
//   {
//     var request = new XMLHttpRequest();
//     request.open('GET', `${this.url1}/getSingleTransactionMadLivraison/${route_param_id}`, false);  // `false`
//     //makes the request synchronous
//     request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     request.send(null);
//     if (request.status == 200) {
//         return request.response;
//     } else {
//         console.log("erreur");
//     }
//   }
//   public getDataSynchronous(data) {
//     var request = new XMLHttpRequest();
//     request.open('POST', `${this.url2}/seeFileContentMADFile`, false);  // `false`
//     //makes the request synchronous
//     request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//     request.send(JSON.stringify(data));
//     if (request.status == 200) {
//         return request.response;
//     } else {
//         console.log("erreur");
//     }
// }

public seeAllFileTransaction (data): Observable<any> {
  return  this.http.post(`${this.url2}/seeAllFileContentMADFile`,data);
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

}
