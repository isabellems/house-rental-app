import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise
import 'rxjs/add/operator/map';

@Injectable()
export class LogoutService {
  private url = 'https://localhost:3000/logout';

  constructor(private http: Http) {}

  logout(): Promise<any> {
	return this.http.get(this.url, {headers: new Headers({'Content-Type': 'application/json'})})
		.map(res => res)
        .toPromise();
  }

}
