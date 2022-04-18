import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddFactureService {

  constructor() { }



  public getAdvancedHeaders() {
    return [
      {
        name: 'Jour',
        sort: 0,

      },
      {
        name: 'IDF Jour',
        sort: 0,

      },
      {
        name: 'IDF Nuit',
        sort: 0,

      },
      {
        name: 'IDF Province',
        sort: 0,

      }
    ];
  }
}
