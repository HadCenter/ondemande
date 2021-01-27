import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  private users: any[] = JSON.parse(localStorage.getItem('users')) || [];

  constructor() { }

  // with real backend you don't need it at all
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null).pipe(mergeMap(() => {

      // signup
      if (request.url.endsWith('/api/auth/signup') && request.method === 'POST') {

        const newUser = request.body;

        // validation
        const duplicateUser = this.users.filter(user => user.email === newUser.email).length;
        if (duplicateUser) {
          return throwError({ error: { message: 'Email "' + newUser.email + '" is already taken' } });
        }
        const body = {
          token: 'token_' + this.makeID(),
          user: {
            username: request.body['username'],
            email: request.body['email'],
            password: request.body['password'],
          },
        };
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // respond 200 OK
        return of(new HttpResponse({ body, status: 200 }));
      }

      // login
      if (request.url.endsWith('/api/auth/login') && request.method === 'POST') {

        const filteredUsers = this.users.filter((user) => {
          return (user.email === request.body.email && user.password === request.body.password
          );
        });
        console.log('filteredUsers', filteredUsers)
        if (filteredUsers.length) {
          const curuser = filteredUsers[0];
          const body = {
            token: 'token_' + this.makeID(),
            user: {
              password: curuser.username,
              email: curuser.email,
              username: curuser.username,
            },
          };

          return of(new HttpResponse({ body, status: 200 }));
        }
        else if (filteredUsers.length == 0 && ((
          request.body.email == 'y.kara@ecolotrans.com' &&
          request.body.password === 'karaecolotrans2020.') || (
            request.body.email == 'j.viguier@ecolotrans.com' &&
            request.body.password === 'viguierecolotrans2020.'

          ))) {
          console.log("request body", request.body)
          const curuser = request.body;
          if (curuser.email == 'y.kara@ecolotrans.com') {
          curuser.username = 'Kara'
          } else { curuser.username = 'Viguier'; }
          const body = {
            token: 'token_' + this.makeID(),
            user: {
              password: curuser.password,
              email: curuser.email,
              username: curuser.username,
            },
          };

          return of(new HttpResponse({ body, status: 200 }));

        }

        else {
          return throwError({ error: { message: 'Username or password is incorrect' } });
        }

      }

      // logout
      if (request.url.endsWith('/api/auth/logout') && request.method === 'GET') {
        return of(new HttpResponse({ body: { success: true }, status: 200 }));
      }

      // at default just process the request
      return next.handle(request);
    }))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());
  }

  // generate random token
  private makeID(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 25; i = i + 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
