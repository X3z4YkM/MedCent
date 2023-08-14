import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { PatientService } from '../services/patient.service';
import { DoctorService } from '../services/doctor.service';
import { Router } from '@angular/router';
import { PatientDoctorProfileData } from '../models/patient.doctor.view';
import { DoctorServiceData } from '../models/doctor.servic';
import * as $ from 'jquery';
import { CalanderData } from '../models/calender.model';
import { PatientProfileData } from '../models/patient.profile';

@Component({
  selector: 'app-doctor-profile-view',
  templateUrl: './doctor-profile-view.component.html',
  styleUrls: ['./doctor-profile-view.component.css'],
})
export class DoctorProfileViewComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private servic_patient: PatientService,
    private service_doctor: DoctorService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    localStorage.removeItem('request');
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  req: PatientDoctorProfileData;
  services: DoctorServiceData[] = [];
  date_calander: Date = new Date();
  calander_data: CalanderData[] = null;
  my_token: string;
  my_data: PatientProfileData;
  intervalId: any;
  ngOnInit(): void {
    const request = localStorage.getItem('request');
    if (request) {
      let id = JSON.parse(request);

      //localStorage.removeItem('request');
      this.my_token = sessionStorage.getItem('user_token');
      this.servic_patient.getUserById(id).subscribe((data) => {
        if (data['status'] === 200) {
          this.req = data['data']['_doc'];
          let imgP = data['data']['image'];
          const uint8Array = new Uint8Array(imgP['data']);
          const base64String = btoa(String.fromCharCode(...uint8Array));
          this.req.img_profile = null;
          this.req.img_path = `data:image/png;base64,${base64String}`;
          this.service_doctor
            .get_doctor_services_pdv(this.req)
            .subscribe((dataS) => {
              if (dataS['status'] === 200) {
                this.services = dataS['data'];

                this.service_doctor
                  .get_calender_for_doctor_id(this.req._id)
                  .subscribe((data) => {
                    if (data['status'] == 200) {
                      this.calander_data = data['data'];
                      // add to view
                      this.calander_data = this.calander_data.filter(
                        (entry) => !entry.cancled
                      );
                      const calander_data = this.calander_data.map((entry) => {
                        const dateStart = new Date(entry.date_start);
                        const year = dateStart.getFullYear();
                        const month = (dateStart.getMonth() + 1)
                          .toString()
                          .padStart(2, '0'); // Adding 1 to the month index
                        const day = dateStart
                          .getDate()
                          .toString()
                          .padStart(2, '0');
                        const syntaxsugger = `${year}${month}${day}`;
                        this.servic_patient
                          .getPatientFromToken(this.my_token)
                          .subscribe((data) => {
                            if (data['status'] === 200) {
                              this.my_data = data['user'];
                            }
                          });
                        return {
                          ...entry,
                          syntaxsugger,
                        };
                      });
                    }
                  });
              }
            });
        } else {
        }
      });
    }

    //calender
    $(document).ready(() => {
      $('.desno').on('click', () => {
        this.date_calander.setMonth(this.date_calander.getMonth() + 1);
        this.renderCalendar();
      });
      $('.levo').on('click', () => {
        this.date_calander.setMonth(this.date_calander.getMonth() - 1);
        this.renderCalendar();
      });
      this.renderCalendar();

      
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

      $(".for_cal_res_f").hide()

      $(".calander_button").on('click',()=>{
        $(".form_button").removeClass("active_select")
        $(".calander_button").addClass("active_select")
        $(".for_cal_res_f").toggle()
        $(".form_calendar").toggle()
      })
      
      $(".form_button").on('click',()=>{
        $(".calander_button").removeClass("active_select")
        $(".form_button").addClass("active_select")
        $(".for_cal_res_f").toggle()
        $(".form_calendar").toggle()
      })

    });
    this.servic_patient.get_expiration_time(sessionStorage.getItem('user_token')).subscribe((response)=>{
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

  //calander methods

  renderCalendar() {
    this.date_calander.setDate(1);

    const monthDays = document.querySelector('.days2');

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

    const firstDayIndex = this.date_calander.getDay();

    const lastDayIndex = new Date(
      this.date_calander.getFullYear(),
      this.date_calander.getMonth() + 1,
      0
    ).getDay();

    const nextDays = 7 - lastDayIndex - 1;

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    document.querySelector('#monthID').innerHTML =
      months[this.date_calander.getMonth()];
    let godine = this.date_calander.getFullYear();

    godine = godine * 10000;
    let days = '';

    for (let x = firstDayIndex; x > 0; x--) {
      days += `<li class="prev-date" id="${
        godine + (this.date_calander.getMonth() - 1) * 100 + prevLastDay - x + 1
      }">${prevLastDay - x + 1}<span></span></li>`;
    }
    for (let i = 1; i <= lastDay; i++) {
      if (
        i === new Date().getDate() &&
        this.date_calander.getMonth() === new Date().getMonth()
      ) {
        days += `<li class="today" id="${
          godine + this.date_calander.getMonth() * 100 + i
        }">${i}<span></span></li>`;
      } else {
        days += `<li id="${
          godine + this.date_calander.getMonth() * 100 + i
        }">${i}<span></span></li>`;
      }
    }
    for (let j = 1; j <= nextDays; j++) {
      days += `<li class="next-date" id="${
        godine + (this.date_calander.getMonth() + 1) * 100 + j
      }">${j}<span></span></li>`;
      monthDays.innerHTML = days;
    }
    $('ul.days2 li').css({
      'list-style-type': 'none',
      display: 'inline-block',
      width: '12.79%',
      height: '19%',
      'text-align': 'left',
      'padding-left': '10px',
      'margin-left': '11px',
      'margin-bottom': '11px',
      'font-size': '22px',
      color: '#777',
      'border-radius': '10px',
      'border-color': 'rgb(202, 202, 202)',
      'border-style': 'solid',
      'border-width': '1px',
      position: 'relative',
    });
    $('.days2 li').on('click', (event) => {
      const id = $(event.currentTarget).attr('id');
      this.openForm(id);
    });
  }

  closeForm() {
    const myForm = document.getElementById('myForm');
    this.renderer.setStyle(myForm, 'display', 'none');
    const targetDiv = this.el.nativeElement.querySelector('.view_ch');
    const clonedDiv = targetDiv.cloneNode(false);
    targetDiv.parentNode.insertBefore(clonedDiv, targetDiv);
    targetDiv.parentNode.removeChild(targetDiv);
  }
  openForm(id) {
    let dann = id % 100;
    let mesec = id % 10000;
    mesec = Math.floor(mesec / 100 + 1);
    let godina = Math.floor(id / 10000);
    document.getElementById('currDate').innerHTML =
      dann + '.' + mesec + '.' + godina;
    document.getElementById('myForm').style.display = 'block';
    const targetYear = parseInt(id.substring(0, 4), 10);
    const targetMonth = parseInt(id.substring(4, 6), 10);
    const targetDay = parseInt(id.substring(6, 8), 10);

    const elementsForTargetDate = this.calander_data.filter((entry) => {
      const dateStart = new Date(entry.date_start);
      const entryYear = dateStart.getFullYear();
      const entryMonth = dateStart.getMonth();
      const entryDay = dateStart.getDate();

      return (
        entryYear === targetYear &&
        entryMonth === targetMonth &&
        entryDay === targetDay
      );
    });

    elementsForTargetDate.forEach((elemnt) => {
      const dateStart = new Date(elemnt.date_start);
      const startH = dateStart.getHours();
      const startM = dateStart.getMinutes();
      const dateEnd = new Date(elemnt.date_end);
      const endH = dateEnd.getHours();
      const endM = dateEnd.getMinutes();
      let start = `${startH}:${startM}`;
      let end = `${endH}:${endM}`;
      let firstname = elemnt.firstname;
      let lasttane = elemnt.lastname;

      let id_b_d = `d${dateStart.getFullYear()}${(dateStart.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${dateStart
        .getDate()
        .toString()
        .padStart(2, '0')}${dateStart
        .getHours()
        .toString()
        .padStart(2, '0')}${dateStart
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      const viewChDiv = this.el.nativeElement.querySelector('.view_ch');

      const wrapperDiv = this.renderer.createElement('div');
      this.renderer.addClass(wrapperDiv, 'wrapper_view');

      const wrapperDivInfo = this.renderer.createElement('div');
      this.renderer.addClass(wrapperDivInfo, 'info-container');

      const cal_data = this.renderer.createElement('span');
      this.renderer.appendChild(
        cal_data,
        this.renderer.createText(`${firstname} ${lasttane}:  ${start}-${end}`)
      );
      this.renderer.addClass(cal_data, 'time-span');
      this.renderer.appendChild(wrapperDiv, wrapperDivInfo);
      this.renderer.appendChild(wrapperDivInfo, cal_data);

      this.date_inspection(elemnt);

      console.log('----------');
      console.log(elemnt.cancled === false);
      console.log(this.chechkStatusCancle(elemnt));
      console.log(elemnt.patient_id === this.my_data._id);
      console.log('----------');
      if (
        elemnt.cancled === false &&
        this.chechkStatusCancle(elemnt) &&
        elemnt.patient_id === this.my_data._id
      ) {
        const cancelImg = this.renderer.createElement('img');
        cancelImg.src = '../../assets/icons/MedCent Delete.svg';
        this.renderer.setAttribute(cancelImg, 'id', 'cancle_date');
        this.renderer.addClass(cancelImg, 'cancel-button');
        this.renderer.appendChild(wrapperDivInfo, cancelImg);
        this.renderer.listen(cancelImg, 'click', () => {
          alert('caceled');
        });
      }

      this.renderer.appendChild(viewChDiv, wrapperDiv);
    });

    //for form
    const isPast = this.isDateInPast(dann, mesec, godina);

    if (isPast) {
      const viewChDiv = this.el.nativeElement.querySelector('.view_ch');
      const wrapperDiv = this.renderer.createElement('div');
      this.renderer.addClass(wrapperDiv, 'wrapper_view');
      const wrapperDivInfo = this.renderer.createElement('div');
      this.renderer.addClass(wrapperDivInfo, 'add-container');
      const cal_data = this.renderer.createElement('span');
      this.renderer.appendChild(cal_data, this.renderer.createText(`+`));
      this.renderer.addClass(cal_data, 'span_add_res');
      this.renderer.appendChild(wrapperDiv, wrapperDivInfo);
      this.renderer.appendChild(wrapperDivInfo, cal_data);
      this.renderer.appendChild(viewChDiv, wrapperDiv);
      // click funtionality

      this.renderer.listen(cal_data, 'click', () => {
        this.plus_clikc_logic(cal_data, wrapperDivInfo)
      });
    }
  }

  plus_clikc_logic(cal_data, wrapperDivInfo){
    this.renderer.setStyle(cal_data, 'display', 'none');
    const forCalResDiv = this.renderer.createElement('div');
    this.renderer.addClass(forCalResDiv, 'for_cal_res');

    // Create the div with class 's_title' and add the 'Select service' span
    const sTitleDiv = this.renderer.createElement('div');
    this.renderer.addClass(sTitleDiv, 's_title');
    const sTitleSpan = this.renderer.createElement('span');
    this.renderer.appendChild(
      sTitleSpan,
      this.renderer.createText('Select service:')
    );
    this.renderer.appendChild(sTitleDiv, sTitleSpan);
    this.renderer.appendChild(forCalResDiv, sTitleDiv);

    // Create the div with class 'checkbox_cla_container' and add checkbox elements
    const checkboxContainerDiv = this.renderer.createElement('div');
    this.renderer.addClass(checkboxContainerDiv, 'checkbox_cla_container');
    for (const s of this.services) {
      const checkboxDiv = this.renderer.createElement('div');
      this.renderer.addClass(checkboxDiv, 'cehchkboxes_cal');
      const checkboxInput = this.renderer.createElement('input');
      checkboxInput.setAttribute('type', 'checkbox');
      const checkboxText = this.renderer.createText(s.servic_name);
      this.renderer.appendChild(checkboxDiv, checkboxText);
      this.renderer.appendChild(checkboxDiv, checkboxInput);
      this.renderer.appendChild(checkboxContainerDiv, checkboxDiv);
    }
    this.renderer.appendChild(forCalResDiv, checkboxContainerDiv);

    // Create the div with class 'date' and add the 'Date' input
    const dateDiv = this.renderer.createElement('div');
    this.renderer.addClass(dateDiv, 'date');
    const dateSpan = this.renderer.createElement('span');
    this.renderer.appendChild(dateSpan, this.renderer.createText('Date:'));
    const dateInput = this.renderer.createElement('input');
    dateInput.setAttribute('type', 'date');
    this.renderer.appendChild(dateDiv, dateSpan);
    this.renderer.appendChild(dateDiv, dateInput);
    this.renderer.appendChild(forCalResDiv, dateDiv);

    // Create the div with class 'time_start' and add the 'Time start' input
    const timeStartDiv = this.renderer.createElement('div');
    this.renderer.addClass(timeStartDiv, 'time_start');
    const timeStartSpan = this.renderer.createElement('span');
    this.renderer.appendChild(
      timeStartSpan,
      this.renderer.createText('Time start:')
    );
    const timeStartInput = this.renderer.createElement('input');
    timeStartInput.setAttribute('type', 'text');
    timeStartInput.setAttribute('placeholder', 'time start hh:mm..');
    this.renderer.appendChild(timeStartDiv, timeStartSpan);
    this.renderer.appendChild(timeStartDiv, timeStartInput);
    this.renderer.appendChild(forCalResDiv, timeStartDiv);

    // Create the div with class 'time_end' and add the 'Time end' input
    const timeEndDiv = this.renderer.createElement('div');
    this.renderer.addClass(timeEndDiv, 'time_end');
    const timeEndSpan = this.renderer.createElement('span');
    this.renderer.appendChild(
      timeEndSpan,
      this.renderer.createText('Time end:')
    );
    const timeEndInput = this.renderer.createElement('input');
    timeEndInput.setAttribute('type', 'text');
    timeEndInput.setAttribute('placeholder', 'time end hh:mm..');
    this.renderer.appendChild(timeEndDiv, timeEndSpan);
    this.renderer.appendChild(timeEndDiv, timeEndInput);
    this.renderer.appendChild(forCalResDiv, timeEndDiv);

    // Create the div with class 'button_wraper_cal_for' and add the submit and cancel buttons
    const buttonWrapperDiv = this.renderer.createElement('div');
    this.renderer.addClass(buttonWrapperDiv, 'button_wraper_cal_for');
    const sendDiv = this.renderer.createElement('div');
    this.renderer.addClass(sendDiv, 'send');
    const sendButton = this.renderer.createElement('button');
    this.renderer.appendChild(
      sendButton,
      this.renderer.createText('submit')
    );
    this.renderer.appendChild(sendDiv, sendButton);
    const cancelDiv = this.renderer.createElement('div');
    this.renderer.addClass(cancelDiv, 'cancle');

    this.renderer.listen(cancelDiv, 'click', () => {
      this.renderer.setStyle(cal_data, 'display', 'block');
      this.destrory_parent_class('add-container');
    });

    const cancelButton = this.renderer.createElement('button');
    this.renderer.appendChild(
      cancelButton,
      this.renderer.createText('cancel')
    );
    this.renderer.appendChild(cancelDiv, cancelButton);
    this.renderer.appendChild(buttonWrapperDiv, sendDiv);
    this.renderer.appendChild(buttonWrapperDiv, cancelDiv);
    this.renderer.appendChild(forCalResDiv, buttonWrapperDiv);

    // Finally, append the 'forCalResDiv' to your wrapper or container element
    this.renderer.appendChild(wrapperDivInfo, forCalResDiv);
  }



  isDateInPast(dd, mm, yyyy) {
    const dateObject = new Date(`${yyyy}-${mm}-${dd}`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (
      dateObject.getFullYear() > currentDate.getFullYear() ||
      (dateObject.getFullYear() === currentDate.getFullYear() &&
        dateObject.getMonth() > currentDate.getMonth()) ||
      (dateObject.getFullYear() === currentDate.getFullYear() &&
        dateObject.getMonth() === currentDate.getMonth() &&
        dateObject.getDate() >= currentDate.getDate())
    )
      return true;
    else return false;
  }

  chechkStatusCancle(element) {
    // const group = ['finished', 'current'];
    // if(group.includes(element.status)){
    //   return false
    // }else{
    //   return true
    // }
    if (element.status === 'finished' || element.status === 'current') {
      return false;
    } else {
      return true;
    }
  }

  date_inspection(element: CalanderData) {
    let currentDate = new Date();
    let startDate = new Date(element.date_start);
    let flag = 0;
    if (
      currentDate.getFullYear() === startDate.getFullYear() &&
      currentDate.getMonth() === startDate.getMonth() &&
      currentDate.getDay() === startDate.getDay()
    ) {
      element.status = 'current';
      flag = 1;
    } else if (
      currentDate.getFullYear() > startDate.getFullYear() &&
      currentDate.getMonth() > startDate.getMonth() &&
      currentDate.getDay() > startDate.getDay()
    ) {
      element.status = 'finished';
      flag = 1;
    }
    if (flag) {
      this.service_doctor
        .get_doctor_services_update_date(element, this.req._id)
        .subscribe((data) => {
          if (data['status'] === 200) {
          } else {
            console.log(data['error_message']);
          }
        });
    }
  }

  destrory_parent(noteImgClass) {
    const targetDiv = this.el.nativeElement.querySelector(`#${noteImgClass}`);
    const clonedDiv = targetDiv.cloneNode(false);
    targetDiv.parentNode.insertBefore(clonedDiv, targetDiv);
    targetDiv.parentNode.removeChild(targetDiv);
  }
  destrory_parent_class(noteImgClass) {
    const targetDiv = this.el.nativeElement.querySelector(`.${noteImgClass}`);
  
    const firstChild = targetDiv.firstElementChild;
    const clonedFirstChild = firstChild.cloneNode(true);
  
    while (targetDiv.childNodes.length > 1) {
      targetDiv.removeChild(targetDiv.lastChild);
    }
  
    targetDiv.removeChild(firstChild);
    targetDiv.appendChild(clonedFirstChild);
  
    this.renderer.listen(clonedFirstChild, 'click', () => {
      const wrapperDivInfo = this.el.nativeElement.querySelector('.add-container');
      this.plus_clikc_logic(clonedFirstChild, wrapperDivInfo)
    });
  }
}
