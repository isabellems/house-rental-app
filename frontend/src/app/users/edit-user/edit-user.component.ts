import { Component, OnInit, ElementRef } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { User } from '../user';
import { UserService } from '../user.service';
import { EditUserService} from './edit-user.service';
import { NgForm,  AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  providers: [UserService,EditUserService]
})
export class EditUserComponent implements OnInit {

	user: User;
	id: string;
	private sub: any;
	submitted: boolean = false;
	dataIsLoaded: boolean = false;
  files: boolean = false;


	constructor(private userService: UserService, private editService: EditUserService, private Aroute: ActivatedRoute, private route: Router, private el: ElementRef, private http: Http) { }

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

    
    onFileChange(fileInput: any){
        var len = fileInput.target.files.length;
        if(len !== 0){
            this.files = true;
        }else{
            this.files = false;
        }
        
     }

  	onSubmit(user: User, isValid: boolean){ 
     


    	this.submitted = true; 
    	if(isValid){

      let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
      let fileCount: number = inputEl.files.length;
      let formData = new FormData();
      var userDetails = JSON.stringify(this.user);
      formData.append('user', userDetails);
      if(fileCount > 0){
        formData.append('photo', inputEl.files.item(0));
      }
    	this.editService.save(formData)
          .subscribe(
             (success) => {
                this.route.navigateByUrl('users/' + this.id);

            },
            (error) => { console.log("error");})
    	}
    	else{
        	console.log("Not valid");
          // this.route.navigateByUrl('user/' + this.id);
    	}
	  }

  	compareIds() {
  		let temp_id = localStorage.getItem('userId');
  		if(temp_id == this.id) {
  			return true;
  		}
  		return false;
  	}
}