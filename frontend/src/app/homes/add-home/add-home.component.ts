import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FlashMessagesService } from 'ngx-flash-messages';
import { HomeService } from '../home.service';
import { User } from '../../users/user';
import { UserService } from '../../users/user.service';
import { Home } from '../home';
import { Router } from '@angular/router';
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-add-home',
  templateUrl: './add-home.component.html',
  styleUrls: ['./add-home.component.css']
})
export class AddHomeComponent implements OnInit {


  public model: Home = new Home(undefined, undefined, "", "");
  user: User;
  dataIsLoaded:boolean = false;
  id:string;

  
    constructor(private homeService: HomeService, private userService: UserService, private el: ElementRef, private router: Router,private flashMessagesService: FlashMessagesService) {

    }

   files: boolean = false;

     ngOnInit() {
       this.id = localStorage.getItem('userId');
       this.userService
      .getUser(this.id)
      .then((user: User) => {
        this.user = user;
        $(document).ready(function() {
         $(".input-group > input").focus(function(e){
         $(this).parent().addClass("input-group-focus");
        }).blur(function(e){
         $(this).parent().removeClass("input-group-focus");
        });
       });
        this.dataIsLoaded = true;
        return user;
      });
        
        this.model.internet = false;
        this.model.air_condition = false;
        this.model.lift = false;
        this.model.heating = false;
        this.model.kitchen = false;
        this.model.living_room = false;
        this.model.television = false;
        this.model.parking = false;
        this.model.smoking = false;
        this.model.pets = false;
        this.model.parties = false;

      }
    
    onFileChange(fileInput: any){
        var len = fileInput.target.files.length;
        if(len !== 0){
            this.files = true;
        }else{
            this.files = false;
        }
        
     }

    upload(home: Home, valid: Boolean) {
    //locate the file element meant for the file upload.
        let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photos');
        let name: HTMLInputElement = this.el.nativeElement.querySelector('#name');
        let fileCount: number = inputEl.files.length;
        let formData = new FormData();

        var startStr = String(home.startDate);
        var endStr = String(home.endDate);
        home.start = startStr.substring(0,15);
        home.end = endStr.substring(0,15);
        var details = JSON.stringify(home);
        formData.append('home', details);
    
        if (fileCount > 0) { // a file was selected              
            for (var x = 0; x < fileCount; x++) {
              formData.append("photos", inputEl.files[x]);
            }
        }
        this.homeService.addHome(formData).subscribe(
             (success) => {
                  this.router.navigate(['/homes'], { queryParams: { search: "all" } });

            },
            (error) => { 
               window.scrollTo(0,0);
               this.flashMessagesService.show("Incorect location input.", {
               classes: ['alert-danger'], 
               timeout: 10000, // Default is 3000
             });
           })
       }

}
