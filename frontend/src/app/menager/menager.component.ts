import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {MenagerService} from '../services/menager.service';
import { UserManagerData } from '../models/manager.user';
import { User } from '../models/user';
import * as $ from 'jquery';
import { cloneDeep } from 'lodash';
import { Location } from '@angular/common';

@Component({
  selector: 'app-menager',
  templateUrl: './menager.component.html',
  styleUrls: ['./menager.component.css']
})
export class MenagerComponent implements OnInit {

  constructor(private router: Router, private servic: MenagerService,private location: Location) { 
 

  }


  user_data: UserManagerData[] = []
  selected_users: any[]=[];
  selected_user: UserManagerData;

  user_requests: UserManagerData[] = []

  ngOnInit(): void {
   
    $(".notifications img").click(function(){
      $(".dropdown-search").removeClass("active");
      $(".dropdown-options").removeClass("active");
      $(".dropdown-notifications").toggleClass("active");
      
    });

    this.servic.get_all_user_data().subscribe((data: UserManagerData[])=>{  
      if(data['status']=== 200){
          this.user_data = data['data']
        
          this.user_data.forEach(elem => {
            let imgP = elem.img_profile
            const uint8Array = new Uint8Array(imgP["data"]);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            elem.edit = false;
            elem.img_profile = null
            elem.img_path = `data:image/png;base64,${base64String}`
            elem.file = `data:image/png;base64,${base64String}`
            elem.file_oup = null;
            elem.file_extension = "";
            elem.img_edit_status = false;
        });
      }
    })

    this.servic.get_all_requests_data().subscribe((data: UserManagerData[])=>{  
      if(data['status']=== 200){
          this.user_requests = data['data']
        
          this.user_requests.forEach(elem => {
            let imgP = elem.img_profile
            const uint8Array = new Uint8Array(imgP["data"]);
            const base64String = btoa(String.fromCharCode(...uint8Array));
            elem.edit = false;
            elem.img_profile = null
            elem.img_path = `data:image/png;base64,${base64String}`
            elem.file = `data:image/png;base64,${base64String}`

        });  
      }
    })


  }


  edit_mode(user: UserManagerData){
      user.edit = true
      this.selected_user = cloneDeep(user)
      this.selected_users.push(
        {
          key: user._id,
          data: this.selected_user
        }
      )
      console.log(this.selected_users)
  }
  view_mode(user: UserManagerData){
    user.edit = false;
    this.selected_users = this.selected_users.filter((obj)=>obj.key !== user._id)
  }

  changeFocus( req: UserManagerData){
    if( req.edit == true){
    
        this.selected_user = this.selected_users.find((obj)=>obj.data._id ===  req._id )['data']
      }
      
  }
   

  save_mode( req){

      if(this.selected_user.file.length > 0 && this.selected_user.img_edit_status){
        this.readImageFile(this.selected_user.file_oup).then((res)=>{
          const data = res;
          this.servic.updateUser(this.selected_user, data).subscribe((data)=>{
            if(data['status']==200){
              console.log("stigo")
              this.selected_user.edit = false;
              this.selected_users = this.selected_users.filter((obj)=>obj.key !==  req._id)
              if(data['cause'] !== "no data was changed"){
               this.user_data = this.user_data.map((obj)=>{
                  if(obj._id ===  req._id ){
                      obj = data['return_data']
                      obj.edit = false   
                      let imgP = data['return_data'].img_profile
                      const uint8Array = new Uint8Array(imgP["data"]);
                      const base64String = btoa(String.fromCharCode(...uint8Array));
                      obj.img_profile = null
                      obj.img_path = `data:image/png;base64,${base64String}`
                  }
                  return obj
                })
              }else{
                 req.edit = false
              }

            }else{
              console.log(data['error_message'])
            }
      })
        })
      }else{
        const data = null;
        this.servic.updateUser(this.selected_user, data).subscribe((data)=>{
          if(data['status']==200){
            console.log("stigo")
            this.selected_user.edit = false;
            this.selected_users = this.selected_users.filter((obj)=>obj.key !==  req._id)
            if(data['cause'] !== "no data was changed"){
             this.user_data = this.user_data.map((obj)=>{
                if(obj._id ===  req._id ){
                    obj = data['return_data']
                    obj.edit = false   
                }
                return obj
              })
            }else{
               req.edit = false
            }

          }else{
            console.log(data['error_message'])
          }
    })
      }
  
  }

  getUser( req){
    if( req.edit == true && this.selected_users.length > 0){
      return this.selected_users.find((obj)=>obj.data._id ===  req._id )['data']
    }
  }

  onFileChange(event: any)  {

    const files = event.target.files as FileList;
    let  user = this.selected_user;
    if (files.length > 0) {
      const file = files[0];
      const _file = URL.createObjectURL(files[0]);
      if (this.validateFileExtension(this.getUser(user),this.getFileExtension(files[0]['type']))) {
        this.checkImageDimensions(_file, (dim_stmt) => {
          if (
            this.validateFileExtension(this.getUser(user), this.getFileExtension(file['type'])) &&
            dim_stmt
          ) {
            this.getUser(user).file = _file;
            this.getUser(user).file_oup = files[0];
            this.getUser(user).img_edit_status = true;
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

  redirect(req){
    localStorage.setItem('request', JSON.stringify(req));
    this.router.navigate(['/patient_view'])
  }

  accept(req: UserManagerData){
    this.servic.update_status(req,"true").subscribe((data)=>{
        if(data['status']==200){
          this.location.replaceState(this.location.path());
          window.location.reload();
        }
    })
  }
  decline(req: UserManagerData){
    this.servic.update_status(req,"decline").subscribe((data)=>{
      if(data['status']==200){
        this.location.replaceState(this.location.path());
        window.location.reload();
      }
  })
  }
  
}
