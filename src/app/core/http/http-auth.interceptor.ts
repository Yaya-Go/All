import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(this.addAuthToken(request))
      .pipe(
        catchError((requestError: HttpErrorResponse) => {
          if (requestError && requestError.status === 401) {
            this.router.navigate(['login']);
          }
          return throwError(() => new Error(requestError.message));
        })
      );
  }

  addAuthToken(request: HttpRequest<any>) {
    const token = '';

    return request.clone({
        setHeaders: {
          Authorization: `YayaGo ${token}`
        }
    });
  }
}
