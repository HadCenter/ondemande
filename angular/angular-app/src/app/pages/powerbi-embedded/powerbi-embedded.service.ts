import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WebsocketService } from 'app/services/websocket.service';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class PowerbiEmbeddedService {
  private url = `${environment.apiBaseUrl}/embededPowerBI`;

  public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
  public messages: Subject<any>;
  data:any={};
 constructor(private httpClient: HttpClient,private wsService: WebsocketService) {
   this.messages = <Subject<any>>wsService.connect(this.WS_URL).map(
     (response: MessageEvent): any => {
       console.warn('resp from websocket',response)
       this.data=response.data;
       let data = response.data;
       return data;
     }
   );
 }

 getUserReport(id : string): Observable<any> {

  return this.httpClient.get<any>(`${this.url}/getUserReports/${id}`);
}
  getAllReports(): Observable<any> {

    return this.httpClient.get<any>(`${this.url}/getAllReports`);
  }
  resumeCapacity(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/resume`);
  }

  suspendCapacity(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/suspend`);
  }

  getCapacityState(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/getCapacityState`);
  }

  refreshDataset(id : string): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/refreshReport/${id}`,{});
  }
  refreshBD(data): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/refreshDatabase`,data);
  }

  getDatasetState(id : string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/getRefreshState/${id}`);
  }

  getRefreshDBState(): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/getPowerBiRefreshButtonStatus`);
  }

  
  public getAdvancedHeaders() {
    return [
        {
            name: 'Nom du rapport',

        },
        {
            name: 'Type',

        },
        {
            name: 'Dernière actualisation',

        },
        // {
        //     name: 'Statut',

        // },
        {
            name : 'Actions'
        }
    ];
  }
}
