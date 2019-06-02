import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { Home } from '../home';
import { User } from '../../users/user'
import { HomeService } from '../home.service';
import { trigger,state,style,transition,animate,keyframes } from '@angular/animations';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
import { UserService } from '../../users/user.service';
import 'rxjs/add/operator/filter';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css'],
  providers: [HomeService]
})

export class HomeListComponent {
  
  p: number = 1
  homes: Home[];
  filter: Home = new Home(undefined, undefined, "", "");
  user: User;
  userId: String;
  dataIsLoaded: boolean = false;

  constructor(private activeRoute: ActivatedRoute, private userService: UserService, private router: Router, private homeService: HomeService) {
        router.events.subscribe(event => {
          if (event instanceof NavigationEnd) { 
                this.getData();
            }
      });
   }

 getUser(){
    this.userService
     .getUser(this.userId)
     .then((user: User) => {
       this.user = user;
       this.dataIsLoaded = true;
       return user;
     });
  }

  getData() {
    $('.dropdown-menu').click(function(e) {
      e.stopPropagation();
    });
    this.userId = localStorage.getItem('userId');
    let params = this.activeRoute.snapshot.queryParams;

    this.homeService
      .getHomes(params)
      .then((homes: Home[]) => {
        this.homes = homes.map((homes) => {
          if(this.userId){
            this.getUser();
          }
          return homes;              
        }),this.sortByPrice();

      }); 

  }

  sortByPrice(){
    let len = this.homes.length;
    let temp:Home;
    for(let j=0; j < len-1 ; j++){
      for (let i=0 ; i < len-1 ; i++){
      if(+this.homes[i].cost_per_day > +this.homes[i+1].cost_per_day){
          temp = this.homes[i];
          this.homes[i] = this.homes[i+1];
          this.homes[i+1] = temp
        }
      }
    }
  }

  ngOnInit() {
    let params = {search: "all"};
    this.getData();
  }

  cancelRoomTypeFilter() {
    this.filter.room_type = null;
     $('.hometype-drop').dropdown('toggle');
  }

  cancelPriceFilter() {
    this.filter.cost_per_day = null;
    $('.price-drop').dropdown('toggle');
  }

  cancelAmenitiesFilter() {
    this.filter.internet = false;
    this.filter.air_condition = false;
    this.filter.heating = false;
    this.filter.kitchen = false;
    this.filter.television = false;
    this.filter.parking = false;
    this.filter.lift = false;
    $('.amenities-drop').dropdown('toggle');
  }

}
