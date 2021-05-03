import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()

export class UsersService {
  private url = `${environment.apiBaseUrl}/api/auth`;
  constructor(private http: HttpClient) { }
  public getAllUsers () : Observable<any> {
    return this.http.get(`${this.url}/getUsers/`);
  }
  public getAdvancedHeaders() {
    return [
        {
            name: 'Nom d\'utilisateur',

        },
        {
            name: 'Email',

        },
        {
            name: 'Profile',

        },
        {
            name: 'Statut',

        },
        {
            name : 'Actions'
        }
    ];
  }
}
