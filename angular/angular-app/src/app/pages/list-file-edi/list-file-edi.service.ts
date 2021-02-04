import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ListFileEdiService {
  private url = 'http://127.0.0.1:8000/api'
  constructor(private http: HttpClient) { }

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

        },
        {
            name: 'Date création',

        },
        {
            name: 'Nom client',

        },
        {
            name: 'Commandes erronées',

        },
        {
            name: 'Commandes validées',

        },
        {
            name: 'Status',

        },

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


}
