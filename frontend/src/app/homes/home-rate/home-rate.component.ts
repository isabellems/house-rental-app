import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Home } from '../home';
import { HomeService } from '../home.service';
import { Review } from '../review'
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-home-rate',
  templateUrl: './home-rate.component.html',
  styleUrls: ['./home-rate.component.css'],
  providers: [HomeService]
})
export class HomeRateComponent implements OnInit {

	  home: Home;
    id: string;
    review:Review = new Review('', undefined);
    private sub: any;
    dataIsLoaded: boolean = false;
    userId:String;

    constructor(private homeService: HomeService, private route: ActivatedRoute, private router: Router, private _location: Location) { }

    ngOnInit() {
      this.userId = localStorage.getItem('userId');
  		this.sub = this.route.params.subscribe(params => {
        	this.id = params['id'];
        	console.log(this.id);
    	});
    	this.homeService
    	.getHome(this.id)
    	.then((home: Home) => {
    		this.home = home;
    	    this.dataIsLoaded = true;
    	    return home;
    	})
  	}

    submit(review, valid){
      this.homeService.addRating(this.id, review)
          .then((res: Response) => {
               console.log("hshhshs")
               // this.router.navigateByUrl('users/' + this.userId);
               this._location.back();
           });
    }
}
