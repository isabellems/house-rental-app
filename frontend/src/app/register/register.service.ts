import { Injectable } from '@angular/core';
import { User } from '../users/user';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';


@Injectable()
export class RegisterService {
	
  private url = 'https://localhost:3000/register';

  constructor(private http: Http) {}
  body: any;

  register(user): Promise<any> {
    this.body = JSON.stringify(user);
  	return this.http.post(this.url, this.body, {headers: new Headers({'Content-Type': 'application/json'})})
  		.map(res => res)
      .toPromise()
      // .catch(this.handleError);
  }

  private handleError(error: any) : Promise<any> {
      return Promise.reject(error.message || error);
  }

}