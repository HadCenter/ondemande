import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable,Subject } from 'rxjs';
import { WebsocketService } from 'app/services/websocket.service';

@Injectable()
export class HomeService {

  private url = `${environment.apiBaseUrl}/api`;
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
   public getNumberOfFilesPerClient () : Observable<any> {
    return this.http.get(`${this.url}/getNumberOfFilesPerClient/`);
  }
  public getAllAnomalies() : Observable<any> {
    return this.http.get(`${this.url}/kpi3/`);
  }

}
