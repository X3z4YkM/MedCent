import { Component, OnInit } from '@angular/core';
import { UserManagerData } from '../models/manager.user';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.css']
})
export class UserProfileViewComponent implements OnInit {

  constructor(private router: Router, private servic: UserService) { 
  }

  req: UserManagerData;

  ngOnInit(): void {
    const request = localStorage.getItem('request');
    if(request){
      this.req = JSON.parse(request);
      localStorage.removeItem('request');
    }
  }

  accept(){
    this.servic.update_status(this.req,"true").subscribe((data)=>{
        if(data['status']==200){
          this.router.navigate(['/manager'])
        }
    })
  }
  decline(){
    this.servic.update_status(this.req,"decline").subscribe((data)=>{
      if(data['status']==200){
        this.router.navigate(['/manager'])
      }
  })
  }

}
