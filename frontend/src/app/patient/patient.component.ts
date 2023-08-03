import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { 
    $(document).ready(()=>{

      this.userService.get_img().subscribe((response) => {
        console.log(response)
        let img_src = response["image"]
        const uint8Array = new Uint8Array(img_src["data"]);
        const base64String = btoa(String.fromCharCode(...uint8Array));
        $("img").attr("src", `data:image/png;base64,${base64String}`);
      
      })
        
    })
  }

  ngOnInit(): void {
  }



}
