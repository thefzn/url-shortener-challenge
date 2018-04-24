import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { UrlModel } from './url.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ShortenerService {
	private errorCallback;
  constructor( private http: HttpClient ) { }	
  shorten (url: string): Observable<UrlModel> {
    return this.http.post<UrlModel>("/api/url", { url: url }, httpOptions).pipe(
      tap((url: UrlModel) => console.log(url)),
      catchError(this.handleError<UrlModel>('Error processing URL'))
    );
  }
	toggle(url:UrlModel) {
    return this.http.put<UrlModel>("/api/url/" + url.hash, { active: url.active }, httpOptions).pipe(
      tap((url: UrlModel) => console.log(url)),
      catchError(this.handleError<UrlModel>('Error activating or deactivating URL'))
    );
	}
	remove(url:UrlModel) {
    return this.http.delete<UrlModel>(url.removeUrl, httpOptions).pipe(
      tap((url: UrlModel) => console.log(url)),
      catchError(this.handleError<UrlModel>('Error activating or deactivating URL'))
    );
	}
	onError (cb: any){
		if(typeof cb == "function"){
			this.errorCallback = cb;
		}
	}
  private handleError<T> (operation = 'Unknown Error', result?: T) {
    return (error: any): Observable<T> => {
			if(typeof this.errorCallback == "function"){
				this.errorCallback(operation);
			}
      return of(result as T);
    };
  }

}
