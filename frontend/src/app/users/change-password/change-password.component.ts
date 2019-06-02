import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Pass } from '../pass';
import { UserService } from '../user.service';
import { EditUserService} from '../edit-user/edit-user.service';
import { EqualValidator } from '../../register/password-validator.directive';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [UserService,EditUserService]
})

export class ChangePasswordComponent implements OnInit {

	user: User;
  data:  Pass = new Pass('', '', '');
	id: string;
	private sub: any;
	submitted: boolean = false;
	dataIsLoaded: boolean = false;
  wrongCredentials: boolean = false;

	constructor(private userService: UserService, private editService: EditUserService, private Aroute: ActivatedRoute, private route: Router) { }

	ngOnInit() {
  	this.sub = this.Aroute.params.subscribe(params => {
      this.id = params['id'];
    });
    this.userService
    .getUser(this.id)
    .then((user: User) => {
      this.user = user;
      this.dataIsLoaded = true;
      return user;
      })
  	}

    checkStatus(res) {
      if(res.status === 200){
        this.wrongCredentials = false;
        this.route.navigateByUrl('users/' + this.id);        
      }
    }

     handleError(){
      this.wrongCredentials = true;
     }

  	onSubmit(data: Pass, isValid: boolean){ 
    	this.submitted = true; 
    	if(isValid){
        	this.editService
             .changePass(this.data)
             .then((res: Response) => {
               this.checkStatus(res)
          }).catch(error => this.handleError());
    	}
    	else{
        	console.log("Not valid");
    	}
    	// this.route.navigateByUrl('user/' + this.id);
	}

  	compareIds() {
  		let temp_id = localStorage.getItem('userId');
  		if(temp_id == this.id) {
  			return true;
  		}
  		return false;
  	}
}
