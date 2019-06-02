import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Query } from './query';
import { Router } from '@angular/router';
import { NgForm, NgModel } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, DateAdapter, NativeDateAdapter } from '@angular/material';
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {


  constructor(private router: Router) {}

  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('location') locationField: NgModel;
  @ViewChild('guests') guestsField: NgModel;
  @ViewChild('arrival1') arrival1: NgModel;
  @ViewChild('departure1') departure1: NgModel;
  @ViewChild('arrival') arrival: NgModel;
  @ViewChild('departure') departure: NgModel;

  ngOnInit() {
    $(document).ready(function() {
       $(".input-group > input").focus(function(e){
       $(this).parent().addClass("input-group-focus");
      }).blur(function(e){
       $(this).parent().removeClass("input-group-focus");
      });
    })
  	this.searchForm.valueChanges.subscribe((value: any) => {
        if ( ((this.locationField.dirty && this.locationField.invalid) && ((this.guestsField.dirty && this.guestsField.invalid) || this.guestsField.untouched) && (((this.arrival.dirty && this.arrival.invalid) || this.arrival.untouched))) ||
            (((this.locationField.dirty && this.locationField.invalid) || this.locationField.untouched) && (this.guestsField.dirty && this.guestsField.invalid) && (((this.arrival.dirty && this.arrival.invalid) || this.arrival.untouched))) ||
            (((this.locationField.dirty && this.locationField.invalid) || this.locationField.untouched) && ((this.guestsField.dirty && this.guestsField.invalid) || this.guestsField.untouched) && (((this.arrival.dirty && this.arrival.invalid)))) 
             ) {
            this.whenErased();
        } 
    });
  }



  query: Query = new Query('', undefined, undefined, undefined);
  guests: number;

  onSubmit(form) {
    if(this.query.guests === null || this.query.guests === undefined || (this.guestsField.dirty && this.guestsField.invalid)){
      // this.query.guests = 0;
      this.guests = 0;
    }
    else{
      this.guests = this.query.guests;
    }
    if(this.query.arrival === undefined || this.query.departure === undefined){
      this.router.navigate(['/homes'], { queryParams: { search: this.query.location, guests: this.guests } });
        // this.guests = 0
    }
    else{
      var arrivalString = String(this.query.arrival);
      var departureString = String(this.query.departure);
      var arrival = arrivalString.substring(0,15);
      var departure = departureString.substring(0,15);
      this.router.navigate(['/homes'], { queryParams: { search: this.query.location, guests: this.guests, arrival: arrival, departure: departure } });
      this.guests = 0
    }

  }

  whenErased() {
  	 this.router.navigate(['/homes'], { queryParams: { search: "all", guests: 0} });
     this.guests = 0;
     this.query.guests = undefined;
  }

}
