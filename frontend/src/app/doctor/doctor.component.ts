import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import {DoctorService} from '../services/doctor.service';
import {DoctorProfileData} from '../models/doctor.profile';
import {DoctorServiceData} from '../models/doctor.servic';
import * as $ from "jquery";

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  constructor(private router: Router, private servic: DoctorService) { }
  doctor: DoctorProfileData
  fake_docot : DoctorProfileData
  services: DoctorServiceData[] = [];
  edit_flag: boolean = false;
  selected_view: string = 'profile'

  ngOnInit(): void {
        $(document).ready(()=>{
        $(".option_profile button").on('click', ()=>{
            $('.active').removeClass('active')
            $(".option_profile").addClass('active')
            this.selected_view = 'profile'
        })

        $(".option_chechkups button").on('click', ()=>{
          $('.active').removeClass('active')
          $('.option_chechkups').addClass('active')
          this.selected_view = 'chechkups'
        })

        $(".option_more button").on('click', ()=>{
          $('.active').removeClass('active')
          $(".option_more").addClass('active')
          this.selected_view = 'more'
        })

      })
      

    if(sessionStorage.getItem('user_token') == undefined)
    {
      this.router.navigate(['/login'])
    }
      let token = sessionStorage.getItem('user_token');
      this.servic.getDoctoFromToken(token).subscribe((data)=>{
          if(data['status'] === 200){
              if(data['user'].type !== 'Doctor') this.router.navigate(['/'])
              this.doctor = data['user']
              let imgP = data['image']
              const uint8Array = new Uint8Array(imgP["data"]);
              const base64String = btoa(String.fromCharCode(...uint8Array));
              this.doctor.edit = false;
              this.doctor.img_profile = null
              this.doctor.img_path = `data:image/png;base64,${base64String}`
              this.doctor.file = `data:image/png;base64,${base64String}`
              this.doctor.file_oup = null;
              this.doctor.file_extension = "";
              this.doctor.img_edit_status = false;
              this.doctor.edit =false
              this.fake_docot = {... this.doctor}
              this.servic.getSpecServicData(token).subscribe((data)=>{
                  if(data['status']===200){
                    console.log(data['services'])
                    this.services = data['services'].map(elem=>{
                      return{
                        servic_name: elem,
                        selected: data['selected'].find((inner)=>{
                          if(inner.servic_name === elem ){
                            return elem
                          }
                        })? true: false,
                        changed: false
                      }
                    })
                  
                  }
              })
          }else{
            // to do set error baner
          }
      })

  
  }


  getUser(){
    return this.fake_docot
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
            this.fake_docot.img_edit_status = !this.fake_docot.img_edit_status;
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


  edit_mode(){
    this.doctor.edit = true
  }
  view_mode(){
    this.doctor.edit = false;
    this.fake_docot = {... this.doctor}
  }

  save_mode(){
    if(this.fake_docot.file.length > 0 && this.fake_docot.img_edit_status){
      this.readImageFile(this.fake_docot.file_oup).then((res)=>{
        const data = res;
        this.fake_docot.file = null;
        this.fake_docot.img_path = null;
        this.servic.save_data(this.fake_docot, data).subscribe((data)=>{
          this.doctor = data['return_data']
          this.doctor.edit = false   
          let imgP = data['return_data'].img_profile
            const uint8Array = new Uint8Array(imgP["data"]);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            this.doctor.img_profile = null
            this.doctor.img_path = `data:image/png;base64,${base64String}`
            this.doctor.file = `data:image/png;base64,${base64String}`
            this.fake_docot = {...this.doctor}
        })
      })
    }else{
      const data = null;
      console.log(this.fake_docot)
      const file = this.fake_docot.img_path
      this.fake_docot.file = null;
      const img_path = this.fake_docot.img_path
      this.fake_docot.img_path = null;
      this.servic.save_data(this.fake_docot, data).subscribe((data)=>{
          if(data['status']===200 && data['cause']==="fileds updated"){
            sessionStorage.removeItem('user_token');
            sessionStorage.setItem('user_token',data['token'])
            this.doctor = data['return_data']
            this.doctor.edit = false   
            this.doctor.img_path = img_path
            this.doctor.file = file;
            this.fake_docot = {...this.doctor}
            
          }else{
            if(data['status']===200){
              this.doctor.edit = false;
              this.fake_docot = {... this.doctor}
            }else{
              console.log(data['error_message'])
            }
          }
      })
    }
  }



  logout(){
    sessionStorage.removeItem('user_token');
    this.router.navigate(['/'])
  }


  edit_mode_s(){
    this.edit_flag = !this.edit_flag
  }
  
  save_mode_s(){
    this.edit_flag = !this.edit_flag

      const token = sessionStorage.getItem('user_token')
      this.servic.save_servic_data(this.services,token).subscribe((data)=>{
        if(data['status']==200){
          this.services = data['data']
        }
      })
  }

  view_mode_s(){
    this.edit_flag = !this.edit_flag
    this.services.forEach(elem=>{
      if(elem.changed){
        elem.selected = !elem.selected;
        elem.changed = false
      }
   
    })
    console.log(this.services)
  }

  
}
