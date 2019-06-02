import { Component, OnInit,  ElementRef , Renderer} from '@angular/core';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { FlashMessagesService } from 'ngx-flash-messages';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-edit-home',
  templateUrl: './edit-home.component.html',
  styleUrls: ['./edit-home.component.css']
})
export class EditHomeComponent implements OnInit {

  home: Home = new Home(undefined, undefined, "", "");;
  id: string;
  private sub: any;
  dataIsLoaded: boolean = false;
  toRemove:any = [];
  photoNumber: number;
  files: boolean = false;
  userId:string;

  constructor(private homeService: HomeService, private el: ElementRef, private router: Router, private activeRoute: ActivatedRoute, private renderer: Renderer, private flashMessagesService: FlashMessagesService) { 
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId');
  	this.sub = this.activeRoute.params.subscribe(params => {
      this.id = params['id'];
    });
  	this.homeService
    .getHome(this.id)
    .then((home: Home) => {
      this.home = home;
      this.photoNumber = home.pictures.length + 1;
      $(document).ready(function() {
       $(".input-group > input").focus(function(e){
       $(this).parent().addClass("input-group-focus");
      }).blur(function(e){
       $(this).parent().removeClass("input-group-focus");
      });
    })
      this.dataIsLoaded = true;
      return home;
    })
  }

  compareIds(){
    return (this.userId == this.home.Host.id);
  }

   onFileChange(fileInput: any){
	    var len = fileInput.target.files.length;
	    if(len !== 0){
	        this.files = true;
	    }else{
	        this.files = false;
	    }    
	}

  remove(event:any, picture){
  	this.renderer.setElementClass(event.target,"clicked",true);
    this.toRemove.push(picture);
  }

  upload(home: Home, valid: Boolean){
  	let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photos');
    let name: HTMLInputElement = this.el.nativeElement.querySelector('#name');
    let token = localStorage.getItem('token');
    let id    = localStorage.getItem('userId');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();

     var startStr = String(home.startDate);
     var endStr = String(home.endDate);
     home.start = startStr.substring(0,15);
     home.end = endStr.substring(0,15);
     var details = JSON.stringify(home);
     formData.append('home', details);

    var rem = JSON.stringify(this.toRemove)
    formData.append('toremove', rem);
    if(fileCount > 0){
	    formData.append('token', token);
	    var ins = inputEl.files.length;
	    for (var x = 0; x < ins; x++) {
	       formData.append("photos", inputEl.files[x]);
   		}
   	}
    this.homeService.editHome(this.id, formData).subscribe(
             (success) => {
                this.router.navigateByUrl('users/' + id);

            },
            (error) => { 
               this.flashMessagesService.show("Incorect location input.", {
               classes: ['alert-danger'], 
               timeout: 10000, // Default is 3000
             });
           })
  }

}
