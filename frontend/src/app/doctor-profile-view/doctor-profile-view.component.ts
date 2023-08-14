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
  is_chechk: boolean = false;
  chechk_value: string= '';

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
                this.services = dataS['services']

                this.service_doctor
                  .get_calender_for_doctor_id(this.req._id)
                  .subscribe((data) => {
                    if (data['status'] == 200) {
                      this.calander_data = data['data'];
                      // add to view
                      // this.calander_data = this.calander_data.filter(
                      //   (entry) => !entry.cancled
                      // );
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

      $('.bottom-next').click(function () {
        $('.popup-background').removeClass('popup-active');
      });

      $('.workoff_input').click(function () {
        $(this).removeClass('input-box-empty');
      });


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
      if(elemnt.cancled === true){
        const s = this.renderer.createElement('s')
        this.renderer.appendChild(
          s,
          this.renderer.createText(`${firstname} ${lasttane}:  ${start}-${end}`)
        )
        this.renderer.appendChild(
          cal_data,
          s
        );
      }else{
        this.renderer.appendChild(
          cal_data,
          this.renderer.createText(`${firstname} ${lasttane}:  ${start}-${end}`)
        );
      }
      this.renderer.addClass(cal_data, 'time-span');
      this.renderer.appendChild(wrapperDiv, wrapperDivInfo);
      this.renderer.appendChild(wrapperDivInfo, cal_data);

      this.date_inspection(elemnt);

      // console.log('----------');
      // console.log(elemnt.cancled === false);
      // console.log(this.chechkStatusCancle(elemnt));
      // console.log(elemnt.patient_id === this.my_data._id);
      // console.log('----------');
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

        //remove reservasion logic
        this.renderer.listen(cancelImg, 'click', () => {
       
          const clickedDate = new Date(dateStart);
          const elem = this.calander_data.find((elemnt)=>{
              return new Date(elemnt.date_start).getTime() === clickedDate.getTime()
          })
          this.servic_patient.cancle_appoinment(this.req._id, this.my_data._id,
            elem.date_start, elem.date_end, elem
            ).subscribe((data)=>{
            if(data['status']===200){
              elem.cancled = true;
              elem.status = 'cancled';
              this.cdr.detectChanges();
              $('.popup-top').addClass('success');
                  $('.top-image img').attr(
                    'src',
                    '../../assets/icons/MedCent Exclamation.svg'
                  );
                  $('.top-message span').text('You have cancled the appoinment!');
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
              $('.top-message span').text("Sorry an error accured...");
              $('.bottom-message span').text('Error something whent wrong while cancling!');
              $('.bottom-next span').text('Return');
              $('.popup-background').addClass('popup-active');
              return
            }
          })
          
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

  my_app_obj: CalanderData = new CalanderData;


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
      checkboxInput.setAttribute('value', s._id);
      
      this.renderer.listen(checkboxInput, 'change', (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
          if (!this.is_chechk) {
            console.log(checkboxInput.value)
            this.chechk_value = checkboxInput.value
            this.is_chechk = true;
            }else{
            checkboxInput.checked = false;
          }
        }else{
          this.is_chechk = false;
          this.chechk_value = '';
        }
      })

      const checkboxText = this.renderer.createText(s.servic_name);
      this.renderer.appendChild(checkboxDiv, checkboxText);
      this.renderer.appendChild(checkboxDiv, checkboxInput);
      this.renderer.appendChild(checkboxContainerDiv, checkboxDiv);
    }
    this.renderer.appendChild(forCalResDiv, checkboxContainerDiv);



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

    this.renderer.listen(sendButton, 'click', () => {
        const servic_id = this.chechk_value;
        const chechk_obj = this.services.find((elem)=>elem._id === servic_id);
        const time_start = timeStartInput.value;
     

        const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

        if (!timeRegex.test(time_start)) {
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Pleas enter time corectly!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }
        if(chechk_obj === undefined){
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Pleas select servic!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }
        const time_end = chechk_obj.time;

        // chchk if time selected can be used 
        const pElement = this.el.nativeElement.querySelector('#currDate');
        const text = pElement.textContent.trim();
        console.log(text);
        const [day, month, year] = text.split(".").map(Number);
        const [houres_s, minutes_s] = time_start.split(":").map(Number);
        const [houres_e, minutes_e] = time_end.split(":").map(Number);
        const inputDateStart = new Date(year, month - 1, day, houres_s, minutes_s);
        const inputDateEnd = new Date(inputDateStart);
        inputDateEnd.setHours(inputDateEnd.getHours() + houres_e);
        inputDateEnd.setMinutes(inputDateEnd.getMinutes() + minutes_e);
        
        const overlappingDates = this.calander_data.filter(data => {
          const dateStart = new Date(data.date_start);
          const dateEnd = new Date(data.date_end);
          return this.checkOverlap(inputDateStart, inputDateEnd, dateStart, dateEnd)&& data.cancled===false;
        });
        
        if(overlappingDates.length>0){
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Date is overlapping!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }else{
            this.servic_patient.add_reservations(
             this.req._id,  this.my_data, 
             chechk_obj.servic_name, inputDateStart,
             inputDateEnd
            ).subscribe((data)=>{
                if(data['status'] === 200){
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
                  this.calander_data.push(data['data']);
                  this.cdr.detectChanges();
                  this.renderer.setStyle(cal_data, 'display', 'block');
                  this.destrory_parent_class('add-container');
                  this.is_chechk = false;

                }else{
                  if(data['status'] === 500){
                    $('.popup-top').removeClass('success');
                    $('.top-image img').attr(
                      'src',
                      '../../assets/icons/MedCent Exclamation.svg'
                    );
                    $('.top-message span').text("Sorry you can't submit...");
                    $('.bottom-message span').text('Server side error!');
                    $('.bottom-next span').text('Return to the form');
                    $('.popup-background').addClass('popup-active');
                    return
                  }else{
                    $('.popup-top').removeClass('success');
                    $('.top-image img').attr(
                      'src',
                      '../../assets/icons/MedCent Exclamation.svg'
                    );
                    $('.top-message span').text("Sorry you can't submit...");
                    $('.bottom-message span').text('Error when updating!');
                    $('.bottom-next span').text('Return to the form');
                    $('.popup-background').addClass('popup-active');
                    return
                  }
                }
            })
        }
        

    })



    this.renderer.appendChild(sendDiv, sendButton);
    const cancelDiv = this.renderer.createElement('div');
    this.renderer.addClass(cancelDiv, 'cancle');
    // cacnle form logic 
    this.renderer.listen(cancelDiv, 'click', () => {
      this.renderer.setStyle(cal_data, 'display', 'block');
      this.destrory_parent_class('add-container');
      this.is_chechk = false;
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

  checkOverlap(start1, end1, start2, end2) {
    return (start1 < end2) && (end1 > start2);
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


  submit_form(){
        const servic_id = this.selectedService;
        const chechk_obj = this.services.find((elem)=>elem._id === servic_id);
        const time_start = $('#time_start_form').val() as string
     

        const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

        if (!timeRegex.test(time_start)) {
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Pleas enter time corectly!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }
        if(chechk_obj === undefined){
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Pleas select servic!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }
        const time_end = chechk_obj.time;
        const selected_date = $("#data_form").val() as string
        
        const result = this.isDateInFutureOrCurrent(selected_date);

        if(!result){
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Pleas select servic!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }

        const [year, month, day] = selected_date.split("-").map(Number);
        const [houres_s, minutes_s] = time_start.split(":").map(Number);
        const [houres_e, minutes_e] = time_end.split(":").map(Number);
        const inputDateStart = new Date(year, month - 1, day, houres_s, minutes_s);
        const inputDateEnd = new Date(inputDateStart);
        inputDateEnd.setHours(inputDateEnd.getHours() + houres_e);
        inputDateEnd.setMinutes(inputDateEnd.getMinutes() + minutes_e);
        
        const overlappingDates = this.calander_data.filter(data => {
          const dateStart = new Date(data.date_start);
          const dateEnd = new Date(data.date_end);
          return this.checkOverlap(inputDateStart, inputDateEnd, dateStart, dateEnd) && data.cancled===false;
        });
        
        if(overlappingDates.length>0){
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text('Date is overlapping!');
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          return
        }else{
          this.servic_patient.add_reservations(
            this.req._id,  this.my_data, 
            chechk_obj.servic_name, inputDateStart,
            inputDateEnd
           ).subscribe((data)=>{
               if(data['status'] === 200){
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
                 this.calander_data.push(data['data']);
                 this.cdr.detectChanges();
                 this.is_chechk = false;
                 $(".for_cal_res_f input[type='checkbox']").prop("checked", false);

               }else{
                 if(data['status'] === 500){
                   $('.popup-top').removeClass('success');
                   $('.top-image img').attr(
                     'src',
                     '../../assets/icons/MedCent Exclamation.svg'
                   );
                   $('.top-message span').text("Sorry you can't submit...");
                   $('.bottom-message span').text('Server side error!');
                   $('.bottom-next span').text('Return to the form');
                   $('.popup-background').addClass('popup-active');
                   return
                 }else{
                   $('.popup-top').removeClass('success');
                   $('.top-image img').attr(
                     'src',
                     '../../assets/icons/MedCent Exclamation.svg'
                   );
                   $('.top-message span').text("Sorry you can't submit...");
                   $('.bottom-message span').text('Error when updating!');
                   $('.bottom-next span').text('Return to the form');
                   $('.popup-background').addClass('popup-active');
                   return
                 }
               }
           })
        }

  }

  isDateInFutureOrCurrent(inputDateString) {
    const inputDate = new Date(inputDateString);
    const currentDate = new Date();
  
    // Compare the dates
    return inputDate >= currentDate;
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
      currentDate.getDate() === startDate.getDate()
    ) {
      element.status = 'current';
      flag = 1;
    } else if (
      currentDate.getFullYear() > startDate.getFullYear() &&
      currentDate.getMonth() > startDate.getMonth() &&
      currentDate.getDate() > startDate.getDate()
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
  selectedService: string = null;

  chechk_data(serviceId: string) {
    this.selectedService = serviceId;
  }

}
