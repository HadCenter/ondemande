import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DetailsTransactionService {

  constructor() { }
  public advanceTableData: any = [{
    transaction: "2", date_debut: "18/03/2021", date_fin: "19/03/2021", statut: "Terminé"
  },
  {
    transaction: "1", date_debut: "16/03/2021", date_fin: "17/03/2021", statut: "Terminé"
  }
  ]
  getTransactionById(id): Observable<any> {
  // const found = array1.find(element => element > 10);
    return this.advanceTableData.find(element=>element.transaction==id)
  }
}
