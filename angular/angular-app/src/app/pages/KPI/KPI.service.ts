import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable,Subject } from 'rxjs';
import { WebsocketService } from 'app/services/websocket.service';

@Injectable()
export class KPIService {

  private url = `${environment.apiBaseUrl}/kpi/`;
  //public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
  public messages: Subject<any>;
  constructor(private http: HttpClient,private wsService: WebsocketService) { 
  }
  public getAllKPI() : Observable<any> {
    return this.http.get(`${this.url}/KPITransport`);
  }

}
