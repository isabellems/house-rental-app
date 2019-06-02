import { Component, OnInit, AfterViewInit, OnChanges } from '@angular/core';
import { Home } from '../home';
import { Reservation } from '../reservation';
import { HomeService } from '../home.service';
import { CommentService } from '../comment.service';
import { UserService } from '../../users/user.service';
import { User } from '../../users/user';
import { Comment } from '../comment';
import { Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
import { FlashMessagesService } from 'ngx-flash-messages';
import { MdButtonModule, MdCheckboxModule, DateAdapter, NativeDateAdapter } from '@angular/material';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'home-details',
  templateUrl: './home-details.component.html',
  styleUrls: ['./home-details.component.css'],
  providers: [HomeService, CommentService]
})

export class HomeDetailsComponent implements OnInit {

  home: Home;
  id: string;
  hostId: String;
  host: User;
  userId: String;
  private sub: any;
  zoom: number = 8;
  dataIsLoaded: boolean = false;
  public reservation: Reservation = new Reservation(undefined,  '', '', undefined, undefined);
  commentbody: Comment = new Comment('');
  p1: number = 1;
  p2: number = 1;

  constructor(private homeService: HomeService, private userService: UserService, private commentService: CommentService, private route: ActivatedRoute, private router: Router, private flashMessagesService: FlashMessagesService) { }

  ngOnInit() {
    this.userId = localStorage.getItem("userId");
  	this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.homeService
    .getHome(this.id)
    .then((home: Home) => {
      this.home = home;
      this.hostId = home.Host.id;
      if(!this.hostId){
       this.dataIsLoaded = true;
      }else{
       this.getUser();
      }
      return home;
    });
  }

  getMonthFromString(mon){
   return (new Date(Date.parse(mon +" 1, 2012")).getMonth()+2)
  }


  myFilter = (d: Date): boolean => {
    var day = d.getDate().toString();
    if(day.length === 1){
      day = "0" + day;
    }
    const month = d.getMonth().toString();
    const year = d.getFullYear().toString();
    var mon = this.getMonthFromString(month);
    const monthN = ("0" + mon).slice(-2);
    const date = year + '-' + monthN + '-' + day;
    var length = this.home.dates.length;
    var avail = true;
    for(var i = 0 ; i < length ; i++){
      if (date >= this.home.dates[i].arrival && date <= this.home.dates[i].departure) {
        avail = false;
      }
    }
    if(date < this.home.start || date > this.home.end){
      avail = false;
    }

    return avail;
  }

  getUser(){
    this.userService
     .getUser(this.hostId)
     .then((user: User) => {
       this.host = user;
       this.dataIsLoaded = true;
       return user;
     });
  }

  getAverage() {
    var sum = 0;
    if(this.home.Reviews.length > 0) {
      for(var i = 0; i < this.home.Reviews.length; i++) {
        sum += +this.home.Reviews[i].rating;
      }
      var average_rating = Math.round(sum/this.home.Reviews.length);
      return Array(average_rating).fill(0).map((x,i)=>i);
    }
    return [];
  }

  showStars(rating: Number) {
    return Array(rating).fill(0).map((x,i)=>i);
  }

  book(reservation: Reservation, isValid: boolean) {

       var arrivalString = String(reservation.arrivalDate);
       var departureString = String(reservation.departureDate);
       reservation.arrival = arrivalString.substring(0,15);
       reservation.departure = departureString.substring(0,15);
      this.homeService.bookHome(this.id, reservation)
          .then((res: Response) => {
              
              this.homeService
              .getHome(this.id)
              .then((home: Home) => {
                this.home = home;
                this.hostId = home.Host.id;
                if(!this.hostId){
                 this.dataIsLoaded = true;
                }else{
                 this.getUser();
                }
                return home;
              });
              window.scrollTo(0,0);
              this.flashMessagesService.show('You successfully booked this place!', {
            classes: ['alert-success'], // You can pass as many classes as you need
            timeout: 50000, // Default is 3000
              });
       });
  }

  onSubmit(commentbody: Comment, valid: Boolean){
    this.commentService.postComment(this.id, this.commentbody)
        .then((res: Response)=> {
          // this.router.navigate(['/homes'+this.id]);
          this.homeService
    .getHome(this.id)
    .then((home: Home) => {
    this.commentbody.text = "";
      
      this.home = home;
      this.hostId = home.Host.id;
      if(!this.hostId){
       this.dataIsLoaded = true;
      }else{
       this.getUser();
      }
      return home;
    });
   })
 }

  hasNoComments(){
    return (this.home.Comments.length == 0);
  }

  hasNoReviews(){
    return (this.home.Reviews.length == 0);
  }

  deleteComment(commentbody : String){
    this.commentService.deleteComment(this.id, commentbody)
    .then((res: Response)=> {
      this.homeService
      .getHome(this.id)
      .then((home: Home) => {
       
      this.home = home;
      this.hostId = home.Host.id;
      if(!this.hostId){
       this.dataIsLoaded = true;
      }else{
       this.getUser();
      }
      return home;
    });
   })
  }

}
