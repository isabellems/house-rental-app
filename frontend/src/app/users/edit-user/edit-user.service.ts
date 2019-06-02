import { Injectable } from '@angular/core';
import { User } from '../user';
import { Pass } from '../pass';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable'; //convert angular observative to a promise


@Injectable()
export class EditUserService {
	
  private url = 'https://localhost:3000/users';

  constructor(private http: Http) {}
  body: any;

  save(formData) {
    let id = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    let urlEdit = this.url + '/' + id + '/edit';
    let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    const options = new RequestOptions({ headers: headers});
    return this.http
            .put(urlEdit, formData, options).map((res:Response) => res.json());

  }

  changePass(pass) : Promise<any>  {
    let id = localStorage.getItem('userId');
    let token = localStorage.getItem('token');
    let headers = new Headers({ 'Authorization': 'Bearer ' + token });
    let urlPass = this.url + '/' + id + '/edit/password';
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify(pass);
    const options = new RequestOptions({ headers: headers});
    return this.http
         .put(urlPass, body, options)
         .map(res => res)
         .toPromise()
         .catch(this.handleError);;

  }

  private handleError(error: any) : Promise<any> {
       console.error('An error occurred', error._body); // for demo purposes only
      return Promise.reject(error.message || error);
  }

}