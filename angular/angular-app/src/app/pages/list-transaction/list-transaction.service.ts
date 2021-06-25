import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebsocketService } from '../../services/websocket.service';

@Injectable()
export class ListTransactionService {

  private url = `${environment.apiBaseUrl}/talendEsb`;
  public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
  public messages: Subject<any>;

  constructor(private http: HttpClient,private wsService: WebsocketService) { 
    this.messages = <Subject<any>>wsService.connect(this.WS_URL).map(
      (response: MessageEvent): any => {
        console.warn('resp from websocket',response)
        let data = response.data;
        return data;
      }
    );
  }
  public getAllTransactions(): Observable<any> {
    return this.http.get(`${this.url}/getAllTransactionMadLivraison`);
  }
  public integrerTransaction(data): Observable<any> {
    return this.http.post(`${this.url}/integrerMADFile`, data);
  }
  public getAdvancedHeaders() {
    return [
      {
        name: 'Date Début',
        sort: 0,

      },
      {
        name: 'Date fin',
        sort: 0,

      },
      {
        name: 'Statut',
        sort: null,

      },
      {
        name: 'Actions',
        sort: null,

      }

    ];
  }

}
