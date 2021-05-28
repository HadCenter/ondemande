import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MagistorService {

    constructor() { }
  public getAdvancedHeaders() {
    return [
      {
        name: 'Fichier',
        sort: 0,

      },
      {
        name: 'Date création',
        sort: 0,

      },
      {
        //             name: '# Code client',
        name: 'Nom client',
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
}
