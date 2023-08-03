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
    this.userService.get_img().subscribe((response) => {
      console.log(response)
      let img_src = JSON.parse(response["image"]);

      console.log(img_src)
      const b64 = Buffer.from(img_src["data"]).toString('base64');
      const mimeType = 'image/png'; 
      $("img").attr("src", `data:${mimeType}; base64,${b64}`);
    })
    

  }

  ngOnInit(): void {
  }



}
