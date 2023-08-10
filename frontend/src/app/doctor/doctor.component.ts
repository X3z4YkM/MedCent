import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import {DoctorService} from '../services/doctor.service';
import {DoctorProfileData} from '../models/doctor.profile';
import {DoctorServiceData} from '../models/doctor.servic';
import {CalanderData} from '../models/calender.model'
import * as $ from "jquery";



@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit, OnDestroy {

  constructor(private router: Router, 
    private servic: DoctorService, 
    private renderer: Renderer2,
    private el: ElementRef) { }
  doctor: DoctorProfileData;
  fake_docot : DoctorProfileData;
  services: DoctorServiceData[] = [];
  edit_flag: boolean = false;
  selected_view: string = 'chechkups';
  sdate: Date = null;
  edate: Date = null;
  error_message_dates : string = "";
  intervalId:any;
  calander_data: CalanderData[] = null;

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  ngOnInit(): void {
    $(document).ready(()=>{
    
      $("#div_chechkups").hide()
      $("#div_more").hide()
   
      $(".optiosn button").on("click",function(){
        var targetDiv = $(this).data("target");
        $('.active').removeClass('active')
        $(this).parent().addClass('active')
        $(".container").hide();
        $("#" + targetDiv).show();
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
      this.servic.get_expiration_time(sessionStorage.getItem('user_token')).subscribe((response)=>{
      let time = (response["data"].houers * 60 * 60 * 1000)+ (response["data"].minuttes*60*1000)+ (response["data"].seconds*1000)
   
      if(this.intervalId){
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        sessionStorage.removeItem('user_token');
        this.router.navigate(['/'])
      }, time);
    })


     $(document).ready(()=>{
      $('.bottom-next').click(function () {
        $('.popup-background').removeClass('popup-active');
      });

      $('.workoff_input').click(function () {
        $(this).removeClass('input-box-empty');
      });

      $("#date_submit").on("click",()=>{
      
        let currentdate = new Date()
        if(this.sdate == null || this.edate == null){
          // if user hasnt inputed a date
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('You must fill marked fields first!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          if(this.sdate == null){
            $("#breakDatestart").addClass('input-box-empty');
          } 
          if(this.sdate == null){
            $("#breakDateend").addClass('input-box-empty');
          }
          return
        }
        if (new Date(this.sdate) <= currentdate || new Date(this.edate) <= currentdate) {
          // dont allow current,past dates
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Dates must be in the future!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          if(new Date(this.sdate) <= currentdate){
            $("#breakDatestart").addClass('input-box-empty');
          } 
          if(new Date(this.edate) <= currentdate){
            $("#breakDateend").addClass('input-box-empty');
          }
          return
        }
        if (new Date(this.sdate) > new Date(this.edate)) {
          // dont allow current,past dates
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('End date has to be after the start date!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          $("#breakDateend").addClass('input-box-empty');
          return
        }
        // everything good, date can be send 
          this.servic.add_workoff_dates(sessionStorage.getItem('user_token'), this.sdate, this.edate).subscribe((data)=>{
            if(data['status']==200){
            
              this.sdate = null;
              this.edate = null;
              $('.popup-top').addClass('success');
              $('.top-image img').attr(
                'src',
                '../../assets/icons/MedCent Exclamation.svg'
              );
              $('.top-message span').text('You have added new workoff dates!');
              $('.bottom-message span').text(
                'Thank you for choosing the MedCent'
              );
              $('.bottom-next span').text(
                'close'
              );

              $('.popup-background').addClass('popup-active');
            }else{
              // date ae overlaping with other dates
              $('.popup-top').removeClass('success');
              $('.top-image img').attr(
                'src',
                '../../assets/icons/MedCent Exclamation.svg'
              );
              $('.top-message span').text("Sorry you can't submit...");
              $('.bottom-message span').text('Dates are overlaping with existing datees!');
              $('.bottom-next span').text('Return to the form');
              $('.popup-background').addClass('popup-active');
              $("#breakDateend").addClass('input-box-empty');
              $("#breakDatestart").addClass('input-box-empty');
              return
            }
          })

      })
    })

    $(document).ready(()=>{
        $('.desno').on("click", ()=>{
          this.date_calander.setMonth(this.date_calander.getMonth() + 1);
          this.renderCalendar();
        })
        $('.levo').on("click", ()=>{
          this.date_calander.setMonth(this.date_calander.getMonth() - 1);
          this.renderCalendar();
        })
        this.renderCalendar()

    })

    // getting data for calander 

    this.servic.get_calender_for_doctor(sessionStorage.getItem('user_token')).subscribe((data)=>{
        if(data['status']==200){
          this.calander_data = data['data'];
          // add to view
          const calander_data = data['data'].map(entry => {
            const dateStart = new Date(entry.date_start);
            const year = dateStart.getFullYear();
            const month = (dateStart.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month index
            const day = dateStart.getDate().toString().padStart(2, '0');
            const syntaxsugger = `${year}${month}${day}`;
            
            return {
              ...entry,
              syntaxsugger
            };
          });

        }
    })


  }


  date_calander: Date = new Date();

  renderCalendar(){
    this.date_calander.setDate(1);
  
    const monthDays = document.querySelector(".days2");
  
    const lastDay = new Date(
      this.date_calander.getFullYear(),
      this.date_calander.getMonth() + 1,
      0
    ).getDate();
  
    const prevLastDay = new Date(
      this.date_calander.getFullYear(),
      this.date_calander.getMonth(),
      0
    ).getDate();
  
    const firstDayIndex =  this.date_calander.getDay();
  
    const lastDayIndex = new Date(
      this.date_calander.getFullYear(),
      this.date_calander.getMonth() + 1,
      0
    ).getDay();
  
  const nextDays = 7 - lastDayIndex - 1;
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  document.querySelector("#monthID").innerHTML = months[ this.date_calander.getMonth()];
  let godine= this.date_calander.getFullYear();

  godine=godine*10000;
  let days = "";
  
    for (let x = firstDayIndex; x > 0; x--) {
      days += `<li class="prev-date" id="${godine+( this.date_calander.getMonth()-1)*100+prevLastDay - x + 1}">${prevLastDay - x + 1}<span></span></li>`;
    }
    for (let i = 1; i <= lastDay; i++) {
      if (
        i === new Date().getDate() &&
        this.date_calander.getMonth() === new Date().getMonth()
      ) {
        days += `<li class="today" id="${godine+ this.date_calander.getMonth()*100+i}">${i}<span></span></li>`;
      } else {
        days += `<li id="${godine+ this.date_calander.getMonth()*100+i}">${i}<span></span></li>`;
      }
    }
    for (let j = 1; j <= nextDays; j++) {
      days += `<li class="next-date" id="${godine+( this.date_calander.getMonth()+1)*100+j}">${j}<span></span></li>`;
      monthDays.innerHTML = days;
    }
    $("ul.days2 li").css({
      "list-style-type": "none",
      "display": "inline-block",
      "width": "12.79%",
      "height": "19%",
      "text-align": "left",
      "padding-left": "10px",
      "margin-left": "11px",
      "margin-bottom": "11px",
      "font-size": "22px",
      "color": "#777",
      "border-radius": "10px",
      "border-color": "rgb(202, 202, 202)",
      "border-style": "solid",
      "border-width": "1px",
      "position": "relative"
    });  
    $(".days2 li").on("click", (event) => {
      const id = $(event.currentTarget).attr("id");
      this.openForm(id);
    });
  };

  closeForm(){
    const myForm = document.getElementById('myForm'); 
    this.renderer.setStyle(myForm, 'display', 'none');
    const targetDiv = this.el.nativeElement.querySelector('.view_ch');
    const clonedDiv = targetDiv.cloneNode(false);
    targetDiv.parentNode.insertBefore(clonedDiv, targetDiv);
    targetDiv.parentNode.removeChild(targetDiv);
  }

  openForm(id) {
      let dann=id%100;
      let mesec=id%10000;
      mesec=Math.floor(mesec/100+1);
      let godina=Math.floor(id/10000);
      document.getElementById("currDate").innerHTML=dann+"."+mesec+"."+godina;
      document.getElementById("myForm").style.display = "block";
      const targetYear = parseInt(id.substring(0, 4), 10);
      const targetMonth = parseInt(id.substring(4, 6), 10) ;
      const targetDay = parseInt(id.substring(6, 8), 10);
      
      const elementsForTargetDate = this.calander_data.filter(entry => {
        const dateStart = new Date(entry.date_start);
        const entryYear = dateStart.getFullYear();
        const entryMonth = dateStart.getMonth();
        const entryDay = dateStart.getDate();
      
        return entryYear === targetYear && entryMonth === targetMonth && entryDay === targetDay;
      });

      elementsForTargetDate.forEach(elemnt=>{
        const dateStart = new Date(elemnt.date_start);
        const startH = dateStart.getHours();
        const startM = dateStart.getMinutes();
        const dateEnd = new Date(elemnt.date_end);
        const endH = dateEnd.getHours();
        const endM = dateEnd.getMinutes();
        let start = `${startH}:${startM}`
        let end =  `${endH}:${endM}`
        let firstname = elemnt.firstname;
        let lasttane = elemnt.lastname
        const viewChDiv = this.el.nativeElement.querySelector('.view_ch');
    
        const wrapperDiv = this.renderer.createElement('div');
        this.renderer.addClass(wrapperDiv, 'wrapper_view');
        const cal_data = this.renderer.createElement('span');
        this.renderer.appendChild(cal_data, this.renderer.createText(`${firstname} ${lasttane}:  ${start}-${end}`));
        this.renderer.addClass(cal_data, 'time-span');
        const cancelImg = this.renderer.createElement('img');
        cancelImg.src = '../../assets/icons/MedCent Delete.svg';
        this.renderer.listen(cancelImg, 'click', () => {alert('cancled')})
        this.renderer.addClass(cancelImg, 'cancel-button');
        this.renderer.appendChild(wrapperDiv, cal_data);
        this.renderer.appendChild(wrapperDiv, cancelImg);
        
        this.renderer.appendChild(viewChDiv, wrapperDiv);
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
   
  }

  new_req:string = ''
  submit_servic_request(){
    if(this.new_req === ''){
      $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Request filld must not be empty!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
      return
    }else{
      this.servic.set_new_req_spec(this.new_req, this.doctor.d_data['specializzazione']).subscribe((data)=>{
        if(data['status']==200){
          $('.popup-top').addClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text('You have submited a reguest!');
          $('.bottom-message span').text(
            'Thank you for choosing the MedCent'
          );
          $('.bottom-next span').text(
            'close'
          );

          $('.popup-background').addClass('popup-active');
        }else{
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Request faild to submit!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
        }
      })
    }
  }

  
}
