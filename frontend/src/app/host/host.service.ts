import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HostService {

  private hostUrl = 'https://localhost:3000/users';
  constructor(private http: Http) { }

  sendRequest(): Promise<any>{
    let token = localStorage.getItem('token');
    let id  = localStorage.getItem('userId');
  	const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    headers.append('Content-Type', 'application/json');
    let url = this.hostUrl + "/" + id + "/request";
    const options = new RequestOptions({ headers: headers});
  	return this.http.post(url, {} , options)
      .toPromise()
      .then(response =>response.json());  //console.log(response.json())})
  }

}
