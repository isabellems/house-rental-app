import { Injectable } from '@angular/core';
import { User } from '../users/user';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
  private url = 'https://localhost:3000/login';

  constructor(private http: Http) { }

  body: any;

  login(user): Promise<any> {
    this.body = JSON.stringify(user);
  	return this.http.post(this.url, this.body, {headers: new Headers({'Content-Type': 'application/json'})})
  		.map(res => res)
      .toPromise().catch(this.handleError);
  }

  private handleError(error: any) : Promise<any> {
       console.error('An error occurred', error._body); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
