import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Home } from '../../homes/home';
import { UserService } from '../user.service';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UserService]
})
export class UserProfileComponent implements OnInit {

	user: User;
	id: string;
	private sub: any;
  host: Boolean = false;
  visitor: Boolean = false;
	dataIsLoaded: boolean = false;
  p1: number = 1;
  p2: number = 1;

	constructor(private userService: UserService, private route: ActivatedRoute) { }

  hasNoHousings(){
    return (this.user.hosting.length === 0);
  }

	ngOnInit() {
  	this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.userService
    .getUser(this.id)
    .then((user: User) => {
      this.user = user;
      this.host = user.host;
      this.visitor = user.visitor;
      this.dataIsLoaded = true;
      return user;
      })
  	}

  	compareIds() {
  		let temp_id = localStorage.getItem('userId');
  		if(temp_id == null) {
  			return 1;
  		}
  		if(temp_id == this.id) {
  			return 2;
  		}
  		return 3;
  	}
    
    alreadyRated(home: Home) {
      for(var i = 0 ; i < this.user.Reviews.length ; i++) {
        if(home._id == this.user.Reviews[i].home.id) {
          return true;
        }
      }
      return false;
    }
}