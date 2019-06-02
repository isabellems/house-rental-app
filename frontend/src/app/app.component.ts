import { Component,OnInit } from '@angular/core';
import { User } from './users/user';
import { UserService } from './users/user.service';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  userInfo: User;
  title = 'app';
  user: boolean = false;
  username: string = '';
  id: string;
  host: Boolean = false;
  admin: Boolean = false;
  dataIsLoaded = false;
  
  constructor(private userService: UserService) { }

  onNotify(message) {
    this.user = true;
    this.username = localStorage.getItem('username');
    this.id = localStorage.getItem('userId');
    this.getUser(this.id);
  }

  logout(message) {
    this.username = '';
    this.user = false;
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("host");
  }

  getUser(id){
      this.user = true;
      this.userService.getUser(this.id)
      .then((user: User) => {
          this.userInfo = user;
          this.host = this.userInfo.host;
          this.admin = this.userInfo.admin;
          this.dataIsLoaded = true;
          return user;
       });
  }

  ngOnInit() {
        $(document).ready(function() {
    $(".input-group > input").focus(function(e){
        $(this).parent().addClass("input-group-focus");
    }).blur(function(e){
        $(this).parent().removeClass("input-group-focus");
    });
   })
    this.username = localStorage.getItem('username');
    this.id = localStorage.getItem('userId');
    if(this.id){
      this.getUser(this.id);
    }
    else{
        this.dataIsLoaded = true;
    }
  }
}
