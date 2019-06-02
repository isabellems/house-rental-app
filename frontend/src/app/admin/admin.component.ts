import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { saveAs as importedSaveAs} from "file-saver";
import { User } from '../users/user';
import { AdminService } from './admin.service'


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  user: User;
  id: string;
  dataIsLoaded: boolean = false;
  users: User[]
  hostUsers : User[]
  p1:number = 1;
  p2:number = 1;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  	this.getData();
  }

  getData(){
    this.id = localStorage.getItem('userId');
    this.adminService
    .getUser(this.id)
    .then((user: User) => {
      this.user = user;
      this.dataIsLoaded = true;
      return user;
      });
  	this.adminService
      .getAllUsers()
      .then((users: User[]) => {
        console.log(users);
        this.users = users.map((users) => {
          return users;              
        });
    }); 
  	this.adminService
      .getHostRUsers()
      .then((hostUsers: User[]) => {
        console.log(hostUsers);
        this.hostUsers = hostUsers.map((hostUsers) => {
          return hostUsers;              
        });
    });   
  }

  accept(user){
  	this.adminService
  	  .acceptUser(user)
  	  .then((res: Response) => {
           this.getData();
      });

  }

  decline(user){
  	this.adminService
  	    .declineUser(user)
  	    .then((res: Response)=> {
  	    	this.getData();
  	    });
  }

  hasNoUsers(){
    return (this.users.length === 0);
  }

  hasNoHostUsers(){
    return (this.hostUsers.length == 0);
  }

  downloadUsers(){
     this.adminService.getUsersXML().subscribe(blob => {
            importedSaveAs(blob, 'users.xml');
        }
    )
  }

  downloadHomes() {
    this.adminService.getHomesXML().subscribe(blob => {
            importedSaveAs(blob, 'homes.xml');
        }
    )
  }

}
