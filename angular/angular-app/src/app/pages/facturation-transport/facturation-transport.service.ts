import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from 'app/services/websocket.service';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturationTransportService {
  private url = `${environment.apiBaseUrl}/talendEsb`;
  private url2 = `${environment.apiBaseUrl}/api`;

  public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
  public messages: Subject<any>;
  data:any={};

  constructor(private http: HttpClient, private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService.connect(this.WS_URL).map(
      (response: MessageEvent): any => {
        console.warn('resp from websocket',response)
        this.data=response.data;
        let data = response.data;
        return data;
      }
    );

   }
  public getAllBillingss(): Observable<any> {
    return this.http.get(`${this.url}/getAllFacturationTransport`);
  }
  public downloadBillingFile(data): Observable<any> {
    return this.http.post(`${this.url}/downloadBillingFile/`,data, { responseType: "blob" });
  }
  public downloadBillingZIP(data): Observable<any> {
    return this.http.post(`${this.url}/downloadBillingFileAsZip/`,data, { responseType: "blob" });
  }
  public getAllFacturesPDFFromSalesforce(): Observable<any> {
    return this.http.get(`${this.url}/GetAllFacturePDFFromSalesforce`);
  }
  public checkFacturationstatusForFile(data): Observable<any> {
    return this.http.post(`${this.url}/checkFacturationForFile/`,data);
  }
  public downloadFacturePDFFromSalesforce(data): Observable<any> {
    return this.http.post(`${this.url}/downloadFacturePDFFromSalesforce/`,data)
  }
  public updateFacture(data) : Observable<any>{
    return this.http.post(this.url+"/changeFacturePrice/", data);
  }
  public getAllFacturationPlans(): Observable<any> {
    return this.http.get(`${this.url}/getAllJobPlans`);
  }
  public launchPlan(data): Observable<any> {
    return this.http.post(`${this.url}/launchPlan/`,data);
  }
  public getAllTransactions(): Observable<any> {
    return this.http.get(`${this.url}/getAllTransactionMadLivraison`);
  }
  public seeAllFileTransaction (data): Observable<any> {
    return  this.http.post(`${this.url2}/seeAllFileContentMADFile`,data);
  }
  public removeclientsandCopyMADFile(data): Observable<any> {
    return this.http.post(`${this.url}/removeclientsandCopyMADFile/`,data);
  }
  public checkFileMAD(): Observable<any> {
    return this.http.get(`${this.url}/checkFileMAD`);
  }
  public getAdvancedHeaders() {
    return [
      {
        name: 'Numéro Facture',
        sort: 0,

      },
      {
        name: 'Compte',
        sort: 0,

      },
      {
        name: 'Date Facture',
        sort: 0,

      },
      {
        name: 'Date échéance',
        sort: 0,

      },
      {
        name: 'Montant HT',
        sort: null,

      },
      {
        name: 'Taux TVA',
        sort: null,

      },
      {
        name: 'Monatnt TVA',
        sort: null,

      },
      {
        name: 'Monatnt TTC',
        sort: null,

      },
      {
        name: 'Actions',
        sort: null,

      }

    ];
  }

}
