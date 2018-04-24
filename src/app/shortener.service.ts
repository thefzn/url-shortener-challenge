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
	loaded: boolean = false;
	private errorCallback;
  constructor( private http: HttpClient ) {}	
  shorten (url: string): Observable<UrlModel> {
    return this.http.post<UrlModel>("/api/url", { url: url }, httpOptions).pipe(
      tap((url: UrlModel) => { }),
      catchError(this.handleError<UrlModel>('Error processing URL'))
    );
  }
	update(hash: string, url: UrlModel) {
		var toUpdate: any = {};
		if(hash != url.hash){
			toUpdate.hash = hash;
		}
		toUpdate.active = url.active;
		
    return this.http.put<UrlModel>("/api/url/" + hash, toUpdate, httpOptions).pipe(
      tap((newUrl: UrlModel) => {}),
      catchError(this.handleError<UrlModel>('Error activating or deactivating URL'))
    );
	}
	remove(url:UrlModel) {
		console.log(url);
    return this.http.delete<UrlModel>(url.removeUrl, httpOptions).pipe(
      tap((url: UrlModel) => {return true;}),
      catchError(this.handleError<UrlModel>('Error activating or deactivating URL'))
    );
	}
	getAll(){
		return this.http.get<UrlModel[]>("/api/url/", httpOptions).pipe(
      tap((urls: UrlModel[]) => { }),
      catchError(this.handleError<UrlModel[]>('Error activating or deactivating URL'))
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
