import { Component, OnInit } from '@angular/core';
import { HostService } from './host.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {

  submitted:boolean = false;

  constructor(private hostService: HostService) { }

  ngOnInit() {
  }

  submit(){
      this.hostService.sendRequest().then((res: Response) =>
      {
        console.log("ok")
      });
       this.submitted = true;
  }

}
