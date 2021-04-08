import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListTransactionService {

  constructor() { }
  public getAdvancedHeaders() {
    return [
      {
        name: 'transaction',
        sort: 0,

      },
      {
        name: 'Date Début',
        sort: 0,

      },
      {
        //             name: '# Code client',
        name: 'Date fin',
        sort: 0,

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
    transaction: "2", date_debut: "18/03/2021", date_fin: "19/03/2021", statut: "Terminé"
  },
  {
    transaction: "1", date_debut: "16/03/2021", date_fin: "17/03/2021", statut: "Terminé"
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
}
