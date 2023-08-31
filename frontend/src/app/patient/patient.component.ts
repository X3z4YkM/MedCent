import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { PatientService } from '../services/patient.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {PatientProfileData} from '../models/patient.profile'
import {GuestService} from '../services/guest.service';
import {GuestDoctorInfo} from '../models/guest.doctor'
import { ChangeDetectorRef } from '@angular/core';
import {ReportData} from '../models/reportInputData'
import { CalanderData } from '../models/calender.model';
import {MyApointmentsdata} from '../models/myapoint'
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})


export class PatientComponent implements OnInit, OnDestroy{

  constructor(private servic: PatientService, private router: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private servicguest: GuestService,
    private cdr: ChangeDetectorRef) {}
  
  
  intervalId: any;
  patient: PatientProfileData;
  fake_patient: PatientProfileData;
  doctors: GuestDoctorInfo[]= []
  temp: GuestDoctorInfo[]= []
  keywords:string[] = ['firstname', 'lastname', 'specializzazione', 'office_branch']
  keywords_filter:string[] = ['Filter firstname', 'Filter lastname', 'Filter specializzazione', 'Filter office_branch']
  my_records: ReportData[] =[]

  my_appoinments: MyApointmentsdata[] = []

  my_selected_services: string[] = []
  
  my_notifi: any[] = []
  

  ngOnInit(): void {

    $(document).ready(()=>{
    
      $("#div_noti").hide()
      $("#div_doctors").hide()
      $("#div_app").hide()
      $("#appoin").hide()

      $("button.records").on("click", function(){
        $("#appoin").hide()
        $("#rec").show()
      })

      $("button.appoin").on("click", function(){
        $("#appoin").show()
        $("#rec").hide()
      })
      $(".optiosn button").on("click",function(){
        var targetDiv = $(this).data("target");
        $('.active').removeClass('active')
        $(this).parent().addClass('active')
        $(".container").hide();
        $('.containernowrap').hide()
        $("#" + targetDiv).show();
      })


      $(".flex_containerdoc").on("click",()=>{
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
      $("#header-search").on("keyup", (event)=>{
        
        const keyCode = event.keyCode || event.which;
        if (keyCode === 13) {
          this.search_doctors()

        }else
        if(keyCode === 32 && event.ctrlKey){
          $(".dropdown-search").addClass("active");
        }else if(keyCode == 8){
          this.search_doctors()
        }else if(keyCode == 27){
          $(".dropdown-search").removeClass("active")
        }
      });


    })


    if(sessionStorage.getItem('user_token') == undefined)
    {
      this.router.navigate(['/login'])
    }
    let token = sessionStorage.getItem('user_token');
    Promise.all([
      new Promise(()=>{
        this.servic.getPatientFromToken(token).subscribe((data)=>{
          if(data['status'] === 200){
              if(data['user'].type !== 'Patient') this.router.navigate(['/'])
              this.patient = data['user']
              let imgP = data['image']
              const uint8Array = new Uint8Array(imgP["data"]);
              const base64String = btoa(String.fromCharCode(...uint8Array));
              this.patient.edit = false;
              this.patient.img_profile = null
              this.patient.img_path = `data:image/png;base64,${base64String}`
              this.patient.file = `data:image/png;base64,${base64String}`
              this.patient.file_oup = null;
              this.patient.file_extension = "";
              this.patient.img_edit_status = false;
              this.patient.edit =false
              this.fake_patient = {... this.patient}
    
              this.servic.get_noti(token).subscribe((data) => {
                if(data['status'] === 200){
                  this.my_notifi = [...this.my_notifi, ...data['data']]                  
                }
              })
    
          }else{
            if(data['message'] === 'manager'){
                this.router.navigate(['/manager/profile'])
            }else{
              this.router.navigate(['/login'])
            }
          }
        })
      })
    ])


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

    // getting doctors
    this.servicguest.getAllDoctors().subscribe((data: GuestDoctorInfo[]) =>{
      this.doctors = data['doctors'];
      this.doctors.forEach(doc => {
          let imgP = doc.img_profile
          const uint8Array = new Uint8Array(imgP["data"]);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          doc.img_path = `data:image/png;base64,${base64String}`
          doc.img_profile = null
      });
      this.temp = this.doctors.map(elem=>elem)
      console.log(this.doctors)
    })


    // getting records
      this.servic.get_my_reports(sessionStorage.getItem('user_token')).subscribe((data) => {
        if(data['status']==200){
            this.my_records = data['data'];
            this.my_records.sort((a, b) => new Date(b.date_of_report).getTime() - new Date(a.date_of_report).getTime());
            this.cdr.detectChanges()
        }else{
          console.log(data['error_message'])
        }
      })

      //getting all apoinments
      this.servic.get_my_apointments(sessionStorage.getItem('user_token')).subscribe((data) => {
          if(data['status']==200){
            this.my_appoinments = data['data']
            this.my_appoinments.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            this.cdr.detectChanges()
        
            const currentDate = new Date();
            const targetDateStart = new Date(currentDate.getTime() + (24 * 60 - 5) * 60 * 1000);
            const targetDateEnd = new Date(currentDate.getTime() + (24 * 60 + 5) * 60 * 1000);
            
            const date24hAway =  this.my_appoinments.find(date => new Date(date.date_start).getTime() >= targetDateStart.getTime() && new Date(date.date_start).getTime() <= targetDateEnd.getTime()  );
            if(date24hAway){
              const date_start_s = new Date(date24hAway.date_start)
            const date_end_s = new Date(date24hAway.date_end)
              console.log(date_start_s.getDay())
              this.my_notifi.push({
                type: "24h",
                seen: false,
                servics: date24hAway.servics,
                date_start: `${date_start_s.getFullYear()}-${date_start_s.getMonth()+1}-${date_start_s.getDate()}  ${date_start_s.getHours()}:${date_start_s.getMinutes()}:00`,
                date_end: `${date_end_s.getFullYear()}-${date_end_s.getMonth()+1}-${date_end_s.getDate()}  ${date_end_s.getHours()}:${date_end_s.getMinutes()}:00`,
                firstname: date24hAway.firstname,
                lastname: date24hAway.lastname
              })
            }

          }else{
            console.log(data['error_message'])
          }
        })
  }

  ngOnDestroy() {
    if (this.intervalId) {
      //sessionStorage.removeItem('user_token');
      //console.log("hooked")
      clearInterval(this.intervalId);
      //this.router.navigate(['/'])
    }
  }


  onFileChange(event: any)  {

    const files = event.target.files as FileList;
    if (files.length > 0) {
      const file = files[0];
      const _file = URL.createObjectURL(files[0]);
      if (this.validateFileExtension(this.getUser(),this.getFileExtension(files[0]['type']))) {
        this.checkImageDimensions(_file, (dim_stmt) => {
          if (
            this.validateFileExtension(this.getUser(), this.getFileExtension(file['type'])) &&
            dim_stmt
          ) {
            this.getUser().file = _file;
            this.getUser().file_oup = files[0];
            this.fake_patient.img_edit_status = !this.fake_patient.img_edit_status;
            this.resetInput();
          }
        });
      }
    }
  }


  checkImageDimensions(imageSrc, callback) {
    const img = new Image();

    img.onload = function () {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const dim_stmt =
        (width === 100 && height === 100) || (width === 300 && height === 300);
      callback(dim_stmt);
    };

    img.onerror = function () {
      callback(false);
    };

    img.src = imageSrc;
  }

  validateFileExtension(user, extension: string): boolean {
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    if (allowedExtensions.includes(extension)) {
      user.file_extension = extension
      return true;
    } else {
      return false;
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('/')[1];
  }

  resetInput(): void {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  readImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        resolve(e.target.result);
      };
  
      reader.onerror = function (e) {
        reject(e.target.error);
      };
  
      reader.readAsDataURL(file);
    });
  }



  logout(){
    sessionStorage.removeItem('user_token');
    localStorage.removeItem('type');
    this.router.navigate(['/']);
  }


  getUser(){
    return this.fake_patient;
  }


  edit_mode(){
    this.patient.edit = true
  }
  view_mode(){
    this.patient.edit = false;
    this.fake_patient = {... this.patient}
  }

  save_mode(){
    if(this.fake_patient.file.length > 0 && this.fake_patient.img_edit_status){
      this.readImageFile(this.fake_patient.file_oup).then((res)=>{
        const data = res;
        this.fake_patient.file = null;
        this.fake_patient.img_path = null;
        this.servic.save_data(this.fake_patient, data).subscribe((data)=>{
          this.patient = data['return_data']
          this.patient.edit = false   
          let imgP = data['return_data'].img_profile
            const uint8Array = new Uint8Array(imgP["data"]);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            this.patient.img_profile = null
            this.patient.img_path = `data:image/png;base64,${base64String}`
            this.patient.file = `data:image/png;base64,${base64String}`
            this.fake_patient = {...this.patient}
        })
      })
    }else{
      const data = null;
      
      const file = this.fake_patient.img_path
      this.fake_patient.file = null;
      const img_path = this.fake_patient.img_path
      this.fake_patient.img_path = null;
      this.servic.save_data(this.fake_patient, data).subscribe((data)=>{
          if(data['status']===200 && data['cause']==="fileds updated"){
            sessionStorage.removeItem('user_token');
            sessionStorage.setItem('user_token',data['token'])
            this.patient = data['return_data']
            this.patient.edit = false   
            this.patient.img_path = img_path
            this.patient.file = file;
            this.fake_patient = {...this.patient}
            
          }else{
            if(data['status']===200){
              this.patient.edit = false;
              this.fake_patient = {... this.patient}
            }else{
              console.log(data['error_message'])
            }
          }
      })
    }
  }



  // page 2 doctors

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
  
      if(Object.keys(extractedValues).length>0){
        this.filter_doctors(extractedValues)
      }

      const extractedValuesFilterASC = {};
      const regexFilterASC = new RegExp(`FilterASC (firstname|lastname|specializzazione|office_branch)`, 'gi');
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
      const regexFilterDESC = new RegExp(`FilterDESC (firstname|lastname|specializzazione|office_branch)`, 'gi');
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

      this.cdr.detectChanges();
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
      }else if (keyword === "office_branch") {
        return a.office_branch.localeCompare(b.office_branch);
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
        }else if (keyword === "office_branch") {
          return b.office_branch.localeCompare(a.office_branch); 
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


  view_profile(req){
    localStorage.setItem('request', JSON.stringify(req));
    this.router.navigate(['/doctor_view'])
  }


  // qr shit
  donwload_function(report, index){
    this.servic.download_one(report, this.patient).subscribe(data=>{
      if(data['status']==200){
        const QR = document.createElement('div');
        QR.innerHTML = data['html'];
        const parent = document.getElementById(index);
        parent.insertAdjacentElement('afterend', QR);
        parent.style.display = 'none'
      }else{
        console.log(data['err'])
      }
    })
  }

  download_all_function(){
    this.servic.download_all(this.my_records, this.patient).subscribe(data=>{
      if(data['status']==200){
        const QR = document.createElement('div');
        QR.innerHTML = data['html'];
        const parent = document.getElementById('download_all');
        parent.insertAdjacentElement('afterend', QR);
        parent.style.display = 'none'
      }else{
        console.log(data['err'])
      }
    })
  }





}
