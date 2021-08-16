import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class MagistorService {

  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
   { }
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
        name: 'Heure création',
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
        name: 'Nombres Annomalies ',
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
}
