import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ListFileEdiArchivesService {
  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient,) { }
  public getAdvancedHeaders() {
    return [
        {
            name: 'Fichier EDI',
            sort: null,

        },
        {
            name: 'Date création',
            sort: null,

        },
        {
            name: 'Nom client',
            sort: null,

        },
        {
            name: 'Statut',
            sort: null,

        },
    ];
  }
  public getAllArchivedFiles () : Observable<any> {
    return this.http.get(`${this.url}/getArchivedFiles/`);
  }
}
