import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebsocketService } from '../../services/websocket.service';

@Injectable()
export class MagistorService {

  private url = `${environment.apiBaseUrl}/api`;
  private url2= `${environment.apiBaseUrl}/talendEsb`;
  public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
  public messages: Subject<any>;
  data:any={};
 constructor(private http: HttpClient,private wsService: WebsocketService) 
 {
   this.messages = <Subject<any>>wsService.connect(this.WS_URL).map(
     (response: MessageEvent): any => {
       console.warn('resp from websocket',response)
       this.data=response.data;
       let data = response.data;
       return data;
     }
   );
 }
 public getAdvancedHeaders() {
    return [
      {
        name: 'Fichier',
        sort: null,

      },
      {
        name: 'Date création',
        sort: null,

      },
      {
        //             name: '# Code client',
        name: 'Nom client',
        sort: null,

      },
      {
        name: 'Type',
        sort: null,

      },
      {
        name: 'Nombres Anomalies ',
        sort: null,

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
  public advanceTableData: any = [{
    fichier: "2", date_creation: "28/05/2021", nom_client: "rutabago",prest_erron: 5, prest_valide: 4, statut: "Terminé"
  },
  {
    fichier: "1", date_creation: "27/05/2021", nom_client: "infarm",prest_erron: 10, prest_valide: 4, statut: "Terminé"
  }
  ]

  public getAdvancedTableNumOfPage(countPerPage)
  {
    return Math.ceil(this.advanceTableData.length / countPerPage);
  }
  public getAdvancedTablePage(page, countPerPage)
  {
    return this.advanceTableData.slice((page - 1) * countPerPage, page * countPerPage);
  }
  public uploadLogisticFile(formData) {
    console.log("web service");
    return this.http.post(`${this.url}/logisticFile/`, formData);
  }
  public getAllLogisticFiles () : Observable<any> {
    return this.http.get(`${this.url}/getLogisticFiles/`);
  }
  public corretFile (data): Observable<any> {
    return  this.http.post(`${this.url2}/startEngineOnMagistorFiles`,data);
  }
  public validateFile (data): Observable<any> {
    return  this.http.post(`${this.url}/validateLogisticFile`,data);
  }
  public downloadFile (data): Observable<any> {
    return  this.http.post(`${this.url}/downloadImportedLogisticFile`,data, { responseType: "blob" });
  }
  public invalidateFile (data): Observable<any> {
    return  this.http.post(`${this.url}/deleteNotValidateLogisticFile`,data);
  }
}
