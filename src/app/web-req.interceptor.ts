import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Subject, empty, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor{
  refreshingAccessToken:boolean;
  accesstokenRefreshed:Subject<any>=new Subject();
  constructor(private authService:AuthService) { this.refreshingAccessToken=false;}
  intercept(request:HttpRequest<any>,next:HttpHandler):Observable<any>{
    request=this.addAuthHeader(request);
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error,error.status);
        if(error.status===401 ){
          return this.refreshAccessToken().pipe(
            switchMap(()=>{
              request=this.addAuthHeader(request);
              return next.handle(request);
            }),
            catchError((err)=>{
              console.log(err);
              this.authService.logout();
              return empty();
            })
          )
        }
        return throwError(error);
      })
    )
  }

  addAuthHeader(request:HttpRequest<any>){
    const token=this.authService.getAccessToken();
    if(token){
      return request.clone({
        setHeaders:{
          'x-access-token':token
        }
      })
    }
    return request;
  }
  refreshAccessToken(){
    if(this.refreshingAccessToken){
      return new Observable(observer=>{
        this.accesstokenRefreshed.subscribe(()=>{
          observer.next();
          observer.complete();
        })
      })
    }else{
      this.refreshingAccessToken=true;
      return this.authService.getNewAccessToken().pipe(
        tap(()=>{
          console.log("Access Token refreshed!");
          this.refreshingAccessToken=false;
          this.accesstokenRefreshed.next('');
        })
      )
    }
  }
}
