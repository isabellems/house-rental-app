import { Injectable } from '@angular/core';
import { Home } from './home';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; 

@Injectable()
export class CommentService {
  private urlHomes = "https://localhost:3000/homes";

  constructor(private http:Http) { }

  postComment(home,com):Promise<any>{
  	let token = localStorage.getItem('token');
	  const headers = new Headers({ 'Authorization': 'Bearer ' + token });
    headers.append('Content-Type', 'application/json');
	  const options = new RequestOptions({ headers: headers});
	  let url = this.urlHomes + '/' + home + '/comments';
    let comment = JSON.stringify(com);
	  return this.http.post(url, comment, options)
	       .map(res => res)
         .toPromise()
  }

  deleteComment(home,id):Promise<any>{
  	let token = localStorage.getItem('token');
	  const headers = new Headers({ 'Authorization': 'Bearer ' + token });
	  const options = new RequestOptions({ headers: headers});
	  let url = this.urlHomes + '/' + home + '/comments/' + id; 
	  return this.http.delete(url, options)
	       .map(res => res)
         .toPromise()
  }
}
