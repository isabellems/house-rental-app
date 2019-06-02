import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../users/user';
import { LoginService } from './login.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  constructor(private logService: LoginService) { 
  }

  formClass: any;

  ngOnInit() {}

  submitted: boolean = false;
  model: User = new User('', '');
  wrongCredentials: boolean = false;

  @Output() currentUser = new EventEmitter<string>();

  checkStatus(res) {
    if(res.status === 200){
      this.wrongCredentials = false;
      let user = res.json().user;
      let token = res.json().token;
      let id = res.json().userId;
      localStorage.setItem('token', token);
      localStorage.setItem('username', user);
      localStorage.setItem('userId', id);
      this.currentUser.emit(user);
      $(".modal").modal("hide");
    }
  }

  handleError(){
      this.wrongCredentials = true;
  }

  onSubmit(model: User, isValid: boolean) { 
  	this.submitted = true; 
    if(isValid){
      this.logService.login(this.model)
      .then((res: Response) => {
         this.checkStatus(res);
      }).catch(error => this.handleError());
    }
    else{
      console.log("not valid");
    }
  }

}
