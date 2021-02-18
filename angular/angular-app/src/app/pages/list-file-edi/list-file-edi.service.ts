import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ListFileEdiService {

//   private url = 'http://127.0.0.1:8000/api'
  private url = `${environment.apiBaseUrl}/api`;
  private urlJobTalend = `${environment.apiBaseUrl}/talendEsb`;

  constructor(private http: HttpClient) { }

  public executeJob(row) : Observable<any> {
    const body = [{"filePath" : row.file, "ClientOwner" : row.client, "fileId" : row.id}]
    console.log(body);
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
            name: '# Nom client',
            sort: 0,

        },
        {
            name: 'Commandes erronées',
            sort: null,

        },
        {
            name: 'Commandes validées',
            sort: null,

        },
        {
            name: 'Status',
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
  public uploadFileInput (clientName, fileName) : Observable<any> {

    return this.http.get(`${this.url}/uploadfile/${clientName}/${fileName}/`, { responseType: "blob" });
  }
  public uploadFileOutput (clientName, fileName) : Observable<any> {

    return this.http.get(`${this.url}/uploadFileOutput/${clientName}/${fileName}/`, { responseType: "blob" });
  }


}
