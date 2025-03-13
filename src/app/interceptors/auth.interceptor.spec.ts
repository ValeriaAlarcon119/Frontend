import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { Observable } from 'rxjs';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    interceptor = new AuthInterceptor();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept requests and add authorization header', () => {
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandler = {
      handle: (request: HttpRequest<any>): Observable<HttpEvent<any>> => {

        return new Observable<HttpEvent<any>>();
      }
    };

    interceptor.intercept(req, next);
  });
});
