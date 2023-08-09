import { Component, OnDestroy, OnInit } from '@angular/core';
import {GuestService} from '../services/guest.service';
import * as $ from "jquery";
import { Router } from '@angular/router';
import { User } from '../models/user';
import { ArrayType } from '@angular/compiler';
import {GuestDoctorInfo} from '../models/guest.doctor'
@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit, OnDestroy{

  intervalId: any;
  index_c:number = 2;
  doctors: GuestDoctorInfo[]= []
  temp: GuestDoctorInfo[]= []
  keywords:string[] = ['firstname', 'lastname', 'specializzazione']
  keywords_filter:string[] = ['Filter firstname', 'Filter lastname', 'Filter specializzazione']

  constructor(private router: Router, private servic: GuestService) {
    
    $(document).ready(function(){
      $(".flex_container").on("click",()=>{
        if( $(".dropdown-search").hasClass('active'))
        {
          $(".dropdown-search").removeClass("active")
        }
      })

      $("#header-search").on("input", function(input){
        if($(this).val() == "") {
            $(".dropdown-search").removeClass("active")
            console.log("empty")
        }
        else {
          if($(this).val() == "") {
            $(".dropdown-search").addClass("active");
          }
        }
    });

    $("#header-search").on("click", function(){
        if($(this).val() == "") {
          $(".dropdown-search").addClass("active");    
        }
    });

    $(".option").on("click",function(){
      const clickedOptionText = $(this).text();
      const headerSearchText = $("#header-search").val() as string;
      const sanitizedHeaderSearchText = headerSearchText === undefined ? "" : headerSearchText;
      const combinedText = sanitizedHeaderSearchText + clickedOptionText;
      $("#header-search").val(combinedText);
      $(".dropdown-search").removeClass("active")
    });



    })
  }


  login(){
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }



  ngOnInit(): void {

    if(sessionStorage.getItem('user_token'))
    {
      this.servic.chechk_token(sessionStorage.getItem('user_token')).subscribe((data)=>{
        if(data['status']==200){
            this.router.navigate([`${data['type'].toLowerCase()}`])
        }
      })
    }

    this.servic.getAllDoctors().subscribe((data: GuestDoctorInfo[]) =>{
      this.doctors = data['doctors'];
      console.log(data['doctors'])
      this.doctors.forEach(doc => {
          let imgP = doc.img_profile
          const uint8Array = new Uint8Array(imgP["data"]);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          doc.img_path = `data:image/png;base64,${base64String}`
          doc.img_profile = null
      });
      this.temp = this.doctors.map(elem=>elem)
    })


    if(this.intervalId){
      
    }else{
      this.intervalId = setInterval(() => {

        $(".img_c").attr("src",`../../assets/img/img${this.index_c}.jpg`)
        $(`#ci${this.index_c}`).removeClass("active")
    
        this.index_c++;
        if(this.index_c>5){
          this.index_c=1
        }
        $(`#ci${this.index_c}`).addClass("active")

      }, 5000);
    }

    
    $("#header-search").on("keyup", (event)=>{
      
      const keyCode = event.keyCode || event.which;
      if (keyCode === 13) {
        this.search_doctors()

      }else
      if(keyCode === 32 && event.ctrlKey){
        $(".dropdown-search").addClass("active");
      }else if(keyCode == 8){
        this.search_doctors()
      }
    });


  }


  search_doctors(){
        this.doctors = this.temp
        event.preventDefault();
      
        const extractedValues = {};
        const regex = new RegExp(`(${this.keywords.join('|')}):\\s*([^\\s]+)(?!\\s)`, 'gi');
        let match;
        while ((match = regex.exec( $("#header-search").val() as string)) !== null) {
          const keyword = match[1]
          const value = match[2];
          extractedValues[keyword] = value;
          
        }
        console.log($("#header-search").val())
        if(Object.keys(extractedValues).length>0){
          this.filter_doctors(extractedValues)
        }

        const extractedValuesFilterASC = {};
        const regexFilterASC = new RegExp(`FilterASC (firstname|lastname|specializzazione)`, 'gi');
        let matchFilterASC;
        while ((matchFilterASC = regexFilterASC.exec($("#header-search").val() as string)) !== null) {
          const keyword = matchFilterASC[1];
          extractedValuesFilterASC[keyword] = keyword;
        }

        if(Object.keys(extractedValuesFilterASC).length>0){
          const keyword = Object.keys(extractedValuesFilterASC);
          for (const key of keyword) {
              this.sort_doctors(key,"asc")
          }
        }

        const extractedValuesFilterDESC = {};
        const regexFilterDESC = new RegExp(`FilterDESC (firstname|lastname|specializzazione)`, 'gi');
        let matchFilterDESC ;
        while ((matchFilterDESC = regexFilterDESC .exec($("#header-search").val() as string)) !== null) {
          const keyword = matchFilterDESC [1];
          extractedValuesFilterDESC [keyword] = keyword;
        }

        if(Object.keys(extractedValuesFilterDESC).length>0){
          const keyword = Object.keys(extractedValuesFilterDESC);
          for (const key of keyword) {
              this.sort_doctors(key,"desc")
          }
        }




         if(Object.keys(extractedValues).length==0
         &&Object.keys(extractedValuesFilterASC).length==0
         &&Object.keys(extractedValuesFilterDESC).length==0) {
          this.doctors = this.temp
        }

  }
  sort_doctors(keyword, type){
    if(type=='asc'){
      this.doctors = this.doctors.sort((a, b) => {
        if (keyword === "firstname") {
          return a.firstname.localeCompare(b.firstname);
        } else if (keyword === "lastname") {
          return a.lastname.localeCompare(b.lastname);
        } else if (keyword === "specializzazione") {
          return a.specializzazione.localeCompare(b.specializzazione);
        }
        return 0;
      });
    }else
      if(type=='desc'){
        this.doctors = this.doctors.sort((a, b) => {
          if (keyword === "firstname") {
            return b.firstname.localeCompare(a.firstname);
          } else if (keyword === "lastname") {
            return b.lastname.localeCompare(a.lastname); 
          } else if (keyword === "specializzazione") {
            return b.specializzazione.localeCompare(a.specializzazione); 
          }
          return 0;
        });

      }



  }
  filter_doctors(extVal) {
    const keyNames = Object.keys(extVal)
    this.doctors = this.doctors.filter((obj) => {
      for (const key of keyNames) {
        if ((obj[key] as string).toLowerCase().startsWith((extVal[key] as string).toLocaleLowerCase())) {
          return true; 
        }
      }
      return false; 
    });
  }

}



