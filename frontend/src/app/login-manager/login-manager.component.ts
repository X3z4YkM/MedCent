import { Component, OnInit } from '@angular/core';
import {User} from '../models/user';
import {UserService} from '../services/user.service';
import * as $ from "jquery";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login-manager',
  templateUrl: './login-manager.component.html',
  styleUrls: ['./login-manager.component.css']
})
export class LoginManagerComponent implements OnInit {

    constructor(private userServic: UserService,
     private router: Router, private location: Location) {

    // jquery stuff
    $(document).ready(()=>{
    //Remove red border
      $(".input-box input").click(function(){
        $(this).parent().removeClass("input-box-empty");
      })

      //Click on the dropdown menu
      $(".dropdown-select").on('click',function(){
        let span = $(this).find(".select-btn span");
        $(this).find(".select-btn").toggleClass("select-btn-clicked");
        $(this).find(".select-btn").removeClass("select-btn-empty");
        $(this).toggleClass("active");
      })
        //Click away from the dropdown menu
      $(".dropdown-select").on("focusout", function(){
        $(this).find(".select-btn").removeClass("select-btn-clicked");
        $(this).removeClass("active");
      })

      $("li").on('click', function(){
        let text = $(this).text();
        let id = $(this).parent().attr("name");
        let selector = "#" + id;
        let span = $(selector);
        span.text(text);
        span.parent().css({"color" : "#444444"});
      })

      //Display the popup
      $(".bottom-next").click(function(){
        $(".popup-background").removeClass("popup-active");
      })
    })
  }
  username: string;
  password: string;
  role: string = 'Manager';
  error_message :string

  ngOnInit(): void {
    if(sessionStorage.getItem('user_token'))
    {
      const type = JSON.parse(localStorage.getItem('type'));
      if(type === 'manager'){
        this.router.navigate(['/manager/profile'])
      }else
      if(type === 'doctor'){
        this.router.navigate(['/doctor'])
      }
      else if(type === 'patient'){
        this.router.navigate(['/patient'])
      }
    }
  }

    login(){
      this.userServic.login(this.username, this.password, this.role).subscribe((response)=>{
        if(response['status'] == 200){
          if(response['user_status']==='true'){
            sessionStorage.setItem('user_token', response["return_token"])
            localStorage.setItem('type',JSON.stringify('manager'));
              this.router.navigate(['/manager/profile'])
          }else{
            this.error_message = "Request still panding";
            $(".popup-top").removeClass("success");
            $(".top-image img").attr("src", "../../assets/icons/MedCent Exclamation.svg");
            $(".top-message span").text("Sorry you can't sign in...");
            $(".bottom-message span").text(this.error_message);
            $(".bottom-next span").text("Return to the form");
            $(".popup-background").addClass("popup-active");
          }

        }
        else {
          this.error_message = "Wrong username or password";
          $(".popup-top").removeClass("success");
          $(".top-image img").attr("src", "../../assets/icons/MedCent Exclamation.svg");
          $(".top-message span").text("Sorry you can't sign in...");
          $(".bottom-message span").text(this.error_message);
          $(".bottom-next span").text("Return to the form");
          $(".popup-background").addClass("popup-active");
        }
      })
    }

   

}
