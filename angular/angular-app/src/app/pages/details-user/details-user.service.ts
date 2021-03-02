import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class DetailsUserService {

  private url = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient)
  { }
}
