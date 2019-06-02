import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { User } from '../users/user';
import { RegisterService } from './register.service';
import { NgForm,  AbstractControl, ValidatorFn } from '@angular/forms'
import { EqualValidator } from './password-validator.directive';
import { AgeValidator } from './age-validator.directive'
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit {

  constructor(private regService: RegisterService) { }

  formClass: any;


  ngOnInit() {
  }


  submitted: boolean = false;

  model: User = new User('', '', '', '', '', '', '', '', '', '', '', '', '', null, false, false, false);
  error: boolean = false;
  alert: string;
  field: string;
  status: any;

  @Output() currentUser = new EventEmitter<string>();

  checkStatus(res) {
    if(res.json().error === 'none'){
      let user = res.json().user;
      let token = res.json().token
      let id = res.json().userId;
      let admin = res.json();
      localStorage.setItem('username', user);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      this.currentUser.emit(user);
      $(".modal").modal("hide");
      this.error= false;
    }
    else{
      this.alert = res.json().error;
      this.field = res.json().field;
      this.error = true;
    }
  }

  onSubmit(model: User, isValid: boolean){ 
    this.submitted = true; 
    if(isValid){
        this.regService.register(this.model)
        .then((res: Response) => {
           this.checkStatus(res);
        });
    }
    else{
      console.log("Not valid");
    }
  }


}
