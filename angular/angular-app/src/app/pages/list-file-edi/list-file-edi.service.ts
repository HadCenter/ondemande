import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FileNameAndClientCode } from 'app/models/FileNameAndClientCode.model';
import { WebsocketService } from '../../services/websocket.service';

@Injectable()
export class ListFileEdiService {

  private url = `${environment.apiBaseUrl}/api`;
  private urlJobTalend = `${environment.apiBaseUrl}/talendEsb`;
   public WS_URL = "ws://52.47.208.8:8000/ws/notifications"
   public messages: Subject<any>;
   data:any={};
  constructor(private http: HttpClient,private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService.connect(this.WS_URL).map(
      (response: MessageEvent): any => {
        console.warn('resp from websocket',response)
        this.data=response.data;
        let data = response.data;
        return data;
      }
    );
  }
   

  public executeJob(row) : Observable<any> {
   // var fileName = decodeURIComponent(row.file);
    const body = [{"filePath" : row.fileName, "ClientOwner" : row.contact.codeClient, "fileId" : row.idFile}]
    return this.http.post(`${this.urlJobTalend}/startEngineOnEdiFiles`, body);
  }

   public advanceTableData: any = [
     {
        "id" : "0",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "1",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "2",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "3",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "4",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "5",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "6",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
     {
        "id" : "7",
       "Fichier_EDI" : "01-02-2020_EDI.xlsx",
       "Date_creation" : "01/02/2021",
       "Client" : "Ahmed",
       "Commandes_erronees" : "_",
      "Commandes_validees" : "_",
      "Status" : "en attente"
     },
   ];
   public getAdvancedHeaders() {
    return [
        {
            name: 'Fichier EDI',
            sort: null,

        },
        {
            name: '# Date création',
            sort: 0,

        },
        {
//             name: '# Code client',
            name: '# Nom client',
            sort: 0,

        },
        {
            name: 'Prestations erronées',
            sort: null,

        },
        {
            name: 'Prestations validées',
            sort: null,

        },
        {
            name: 'Statut',
            sort: null,

        },
        {
            name : 'Actions',
            sort: null,

        }

    ];
  }
  public getAdvancedTableNumOfPage(countPerPage)
  {
    return Math.ceil(this.advanceTableData.length / countPerPage);
  }
  public getAdvancedTablePage(page, countPerPage)
  {
    return this.advanceTableData.slice((page - 1) * countPerPage, page * countPerPage);
  }

  public getOrderById(id)
  {
    var result = this.advanceTableData.filter(obj => {
    return obj.id === id;
    })
    return result;
  }
  public getAllFiles () : Observable<any> {
    return this.http.get(`${this.url}/getFiles/`);
  }
  public downloadFileInput (clientCode, fileName) : Observable<any> {
    let body = new FileNameAndClientCode(fileName, clientCode,);
    return this.http.post(`${this.url}/downloadFile/`,body, { responseType: "blob" });
  }
  public downloadFileOutput (clientCode, fileName) : Observable<any> {
    let body = new FileNameAndClientCode(fileName,clientCode);
    return this.http.post(`${this.url}/downloadFileOutput/`,body, { responseType: "blob" });
  }
  public sendFileToUrbantz(data): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/urbantzEsb/SendFromFileToUrbantzAsTasks/`,data);
   }
}
