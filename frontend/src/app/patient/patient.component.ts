import { Component, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit, OnDestroy{

  constructor(private servic: PatientService, private router: Router) { 
    if(sessionStorage.getItem('user_token') == undefined)
    {
      //TO DO: chchk if user_token is a patient
      this.router.navigate(['/login'])
    }
    $(document).ready(()=>{
      this.servic.get_img(sessionStorage.getItem('user_token')).subscribe((response) => {
       
        let img_src = response["image"]
        const uint8Array = new Uint8Array(img_src["data"]);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        $("img").attr("src", `data:image/png;base64,${base64String}`)
      })
        
    })
    
  }
  intervalId: any;
  ngOnInit(): void {

    this.servic.get_expiration_time(sessionStorage.getItem('user_token')).subscribe((response)=>{
      let time = (response["data"].houers * 60 * 60 * 1000)+ (response["data"].minuttes*60*1000)+ (response["data"].seconds*1000)
      console.log(time)
      if(this.intervalId){
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        sessionStorage.removeItem('user_token');
        this.router.navigate(['/'])
      }, time);
    })
  }

  ngOnDestroy() {
    if (this.intervalId) {
      //sessionStorage.removeItem('user_token');
      //console.log("hooked")
      clearInterval(this.intervalId);
      this.router.navigate(['/'])
    }
  }

}
