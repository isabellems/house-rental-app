import { Injectable } from '@angular/core';
import { Home } from './home';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise'; //convert angular observative to a promise

@Injectable()
export class HomeService {
  private homesUrl = 'https://localhost:3000/homes';
  private addUrl = 'https://localhost:3000/homes/new';


  constructor(private http: Http) {}

   getHomes(param): Promise<Home[]>{
      let parameters = new URLSearchParams();
      let userId = localStorage.getItem('userId');
      if(userId !== undefined){
         parameters.set('userId', userId);
      }
      parameters.set('search', param["search"]);
      parameters.set('guests', param["guests"]);
      if(param["arrival"]){
        parameters.set('arrival', param["arrival"]);
       parameters.set('departure', param["departure"]);
      } 
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers});
      let url = this.homesUrl + '?' + parameters;
      return this.http.get(url, options)
      .toPromise()
      .then(response =>response.json().data as Home[])  
      .catch(this.handleError);
    }


    getHome(id): Promise<Home>{
      let userId = localStorage.getItem('userId');
      const headers = new Headers({'userId': userId});
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers});
      let url = this.homesUrl + '/' + id;
      return this.http.get(url, options)
      .toPromise()
      .then(response =>response.json().data as Home)  
      .catch(this.handleError);
    }

    bookHome(id, reservation): Promise<any>{
      let token = localStorage.getItem('token');
      const headers = new Headers({ 'Authorization': 'Bearer ' + token });
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({ headers: headers});
      let url = this.homesUrl + '/' + id + '/book';
      let body = JSON.stringify(reservation);
      return this.http.post(url, body, options)
           .map(res => res)
           .toPromise()
    }

    addHome(formData){
      let token = localStorage.getItem('token');
      const headers = new Headers({ 'Authorization': 'Bearer ' + token });
      const options = new RequestOptions({ headers: headers});
      return this.http.post(this.addUrl, formData, options)
           .map((res:Response) => res.json())


    }

    editHome(id, formData) {
      let token = localStorage.getItem('token');
      let urlEdit = this.homesUrl + '/' + id + '/edit';
      let headers = new Headers({ 'Authorization': 'Bearer ' + token });
      const options = new RequestOptions({ headers: headers});
      return this.http.put(urlEdit, formData, options)
            .map((res:Response) => res.json());
    }

    addRating(homeId, review): Promise<any>{
      let token = localStorage.getItem('token');
      const headers = new Headers({ 'Authorization': 'Bearer ' + token });
      headers.append('Content-Type', 'application/json');
      const options = new RequestOptions({headers: headers});
      let url = this.homesUrl + '/' + homeId + '/rate' ;
      return this.http.post(url, review, options)
           .map(res => res)
           .toPromise()
    }
    

  private handleError(error: any) : Promise<any> {
  	   console.error('An error occurred', error._body); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
