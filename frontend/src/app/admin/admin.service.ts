import { Injectable } from '@angular/core';
import { User } from '../users/user';
import { Http, Response, RequestOptions, Headers, ResponseContentType} from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise
import 'rxjs/add/operator/map';

@Injectable()
export class AdminService {
  
  private urlAll = "https://localhost:3000/users/all";
  private urlHostR = "https://localhost:3000/users/host";
  private urlAD = "https://localhost:3000/users";
  private urlUserXML = "https://localhost:3000/users/xml";
  private urlHomeXML = "https://localhost:3000/homes/xml";


  constructor(private http: Http) {}

  getUser(id): Promise<User>{
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers});
    let url = this.urlAD + '/' + id;
    return this.http.get(url, options)
    .toPromise()
    .then(response =>response.json().data as User)
  }

  getAllUsers(): Promise<User[]>{
  	  let token = localStorage.getItem('token');
      const headers = new Headers({ 'Authorization': 'Bearer ' + token });
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers});
      return this.http.get(this.urlAll, options)
      .toPromise()
      .then(response =>response.json().data as User[]);
  }

  getHostRUsers(): Promise<User[]>{
  	let token = localStorage.getItem('token');
      const headers = new Headers({ 'Authorization': 'Bearer ' + token });
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers});
      return this.http.get(this.urlHostR, options)
      .toPromise()
      .then(response =>response.json().data as User[]);
  }

  acceptUser(user): Promise<any> {
  	console.log(user);
  	let url = this.urlAD + '/' + user + '/accept';
  	let token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers});
    return this.http.post(url, {}, options)
  	   .map(res => res)
       .toPromise()
      // .catch(this.handleError);
  }

  declineUser(user): Promise<any> {
  	console.log(user);
  	let url = this.urlAD + '/' + user + '/decline';
  	let token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers});
    return this.http.post(url, {}, options)
  	   .map(res => res)
       .toPromise()
      // .catch(this.handleError);
  }

  getUsersXML(){
    let token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
    return  this.http.get(this.urlUserXML, options).map(res => res.blob())
  }

  getHomesXML(){
    let token = localStorage.getItem('token');
    const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
    return  this.http.get(this.urlHomeXML, options).map(res => res.blob())
  }

}
