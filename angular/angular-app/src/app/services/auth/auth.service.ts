import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
const tokenName = 'token';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged$ = new BehaviorSubject(false);
  private url = `${environment.apiBaseUrl}/api/auth`;
  /*private url = 'http://35.180.109.207:8000/api/auth'*/
  /*private url = 'http://127.0.0.1:8000/api/auth'*/
  private user = { };
  // username: 'Aya', email: 'aya.kilani@redlean.io' }; // some data about user

  constructor(private http: HttpClient) {}

  public get isLoggedIn(): boolean {
    return this.isLogged$.value;
  }
  public login(data): Observable<any> {
    return this.http.post(`${this.url}/login/`, data)
      .pipe(
        map((res: { user: any, token: string }) => {
          this.user = res.user;
          localStorage.setItem(tokenName, res.token);
          // only for example
          localStorage.setItem('currentUser', JSON.stringify(this.user));
          this.isLogged$.next(true);
          return this.user;
        }));
  }
  public logout() {
    return this.http.get(`${this.url}/logout`)
      .pipe(map((data) => {
        localStorage.clear();
       // this.user = null;
      //  this.isLogged$.next(false);
        return of(false);
      }));
  }
  public signup(data) : Observable<any> {
    return this.http.post(`${this.url}/register/`, data)
      .pipe(
        map((res: { user: any, token: string }) => {
          this.user = res.user;
          localStorage.setItem(tokenName, res.token);
          // only for example
          localStorage.setItem('username', res.user.username);
          localStorage.setItem('email', res.user.email);
          this.isLogged$.next(true);
          return this.user;
        }));
  }
  public get authToken(): string {
    return localStorage.getItem(tokenName);
  }

  public get userData(): Observable<any> {
    // send current user or load data from backend using token
    return this.loadUser();
  }

  private loadUser(): Observable<any> {
    // use request to load user data with token
    // it's fake and using only for example
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    return of(this.user);
  }
}
