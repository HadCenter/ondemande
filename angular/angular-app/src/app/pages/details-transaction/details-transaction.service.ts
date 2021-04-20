import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsTransactionService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) { }
  public advanceTableData: any = [{
    transaction: "2", date_debut: "18/03/2021", date_fin: "19/03/2021", statut: "Terminé"
  },
  {
    transaction: "1", date_debut: "16/03/2021", date_fin: "17/03/2021", statut: "Terminé"
  }
  ]
  getTransactionById(id): Observable<any> {
    return this.advanceTableData.find(element=>element.transaction==id)
  }
  get(id): Observable<any> {
    return ;
  }
}
