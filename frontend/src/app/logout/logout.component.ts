import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LogoutService } from './logout.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-logout',
	template: '<a class="nav-link" (click)="logUserOut()" href="">Logout</a>',
	providers: [LogoutService]
})

export class LogoutComponent implements OnInit {

  constructor(private logοutService: LogoutService, private router: Router) { }

  @Output() logout = new EventEmitter<string>();

  ngOnInit() {
  }

  logUserOut() {
	    this.logοutService.logout()
		.then((res: Response) => {
	   	this.logout.emit("loggedout");
	   	this.router.navigateByUrl('homes');
	});
  }

}
