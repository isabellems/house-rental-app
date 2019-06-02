import { Injectable } from '@angular/core';
import { User } from './user';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise

@Injectable()
export class UserService {
  private usersUrl = 'https://localhost:3000/users';

  constructor(private http: Http) {}


  getUser(id): Promise<User>{
    let userId = localStorage.getItem('userId');
    const headers = new Headers({'userId': userId});
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers});
    let url = this.usersUrl + '/' + id;
    return this.http.get(url, options)
    .toPromise()
    .then(response =>response.json().data as User)  //console.log(response.json())})
    .catch(this.handleError);
  }

  private handleError(error: any) : Promise<any> {
  	   console.error('An error occurred', error._body); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
