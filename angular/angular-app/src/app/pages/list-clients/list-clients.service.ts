import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ListClientsService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
   { }
   public advanceTableData: any = [
     {
       "id" : "0",
      "Nom" : "Belaiba",
      "Prenom" : "Ahmed",
      "Email" : "ahmed.belaiba@redlean.io",
      "Ville" : "chebba"
     },
     {
       "id" : "1",
      "Nom" : "Belaiba",
      "Prenom" : "Ahmed",
      "Email" : "ahmed.belaiba@redlean.io",
      "Ville" : "chebba"
     },
     {
       "id" : "2",
      "Nom" : "Belaiba",
      "Prenom" : "Ahmed",
      "Email" : "ahmed.belaiba@redlean.io",
      "Ville" : "chebba"
     },
     {
       "id" : "3",
      "Nom" : "Belaiba",
      "Prenom" : "Ahmed",
      "Email" : "ahmed.belaiba@redlean.io",
      "Ville" : "chebba"
     },
     {
       "id" : "4",
      "Nom" : "Belaiba",
      "Prenom" : "Ahmed",
      "Email" : "ahmed.belaiba@redlean.io",
      "Ville" : "chebba"
     }
   ];
   public getAdvancedHeaders() {
    return [
        {
            name: 'Code client',

        },
        {
            name: 'Nom client',

        },
        {
            name: 'Email',

        },
        {
            name: 'Statut'
        },
        {
            name : 'Actions'
        }
    ];
  }
  public getAdvancedTableNumOfPage(countPerPage) {
    return Math.ceil(this.advanceTableData.length / countPerPage);
}
public getAdvancedTablePage(page, countPerPage) {
  return this.advanceTableData.slice((page - 1) * countPerPage, page * countPerPage);
}

public getOrderById(id) {
  var result = this.advanceTableData.filter(obj => {
      return obj.id === id;
  })
  return result;
}
  public getAllClients () : Observable<any> {
    return this.http.get(`${this.url}/getClients/`);
  }

}
