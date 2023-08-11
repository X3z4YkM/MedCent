import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import {DoctorService} from '../services/doctor.service';
import {DoctorProfileData} from '../models/doctor.profile';
import {DoctorServiceData} from '../models/doctor.servic';
import {CalanderData} from '../models/calender.model'
import {ReportData} from '../models/reportInputData'
import * as $ from "jquery";
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  
})
export class DoctorComponent implements OnInit, OnDestroy {

  constructor(private router: Router, 
    private servic: DoctorService, 
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef) { }


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
    
      $("#div_profile").hide()
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
          this.calander_data = this.calander_data.filter(entry => !entry.cancled);
          const calander_data = this.calander_data.map(entry => {
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

  reportData: ReportData = new ReportData();
  user_specific_reports: ReportData[] = [];

  init_reportData(){
    this.reportData.date_of_report = new Date();
    this.reportData.doctors_name = `${this.doctor.firstname}  ${this.doctor.lastname}`
    this.reportData.specializzazione = `${this.doctor.d_data['specializzazione']}`
    this.reportData.reason_for_comming = ""
    this.reportData.diagnosis = ""
    this.reportData.therapy = ""
    this.reportData.next_session = null;
  }
  openForm(id) {
      this.init_reportData();
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
      
        let id_b_d = `d${dateStart.getFullYear()}${(dateStart.getMonth() + 1).toString().padStart(2, '0')}${dateStart.getDate().toString().padStart(2, '0')}${dateStart.getHours().toString().padStart(2, '0')}${dateStart.getMinutes().toString().padStart(2, '0')}`;
        const viewChDiv = this.el.nativeElement.querySelector('.view_ch');
    
        const wrapperDiv = this.renderer.createElement('div');
        this.renderer.addClass(wrapperDiv, 'wrapper_view');

        const wrapperDivInfo = this.renderer.createElement('div');
        this.renderer.addClass(wrapperDivInfo, 'info-container');

        const cal_data = this.renderer.createElement('span');
        this.renderer.appendChild(cal_data, this.renderer.createText(`${firstname} ${lasttane}:  ${start}-${end}`));
        this.renderer.addClass(cal_data, 'time-span');
        cal_data.style.cursor='pointer'

        const cancelImg = this.renderer.createElement('img');
        cancelImg.src = '../../assets/icons/MedCent Delete.svg';
        this.renderer.setAttribute(cancelImg, 'id', 'cancle_date')

               
        const noteImg = this.renderer.createElement('img');
        noteImg.src = '../../assets/icons/MedCent edit.svg';
        this.renderer.setAttribute(noteImg, 'id', 'note_date')
        this.renderer.addClass(noteImg, id_b_d)

        const chechlImg = this.renderer.createElement('img');
        chechlImg.src = '../../assets/icons/MedCent check.svg';
        this.renderer.setAttribute(chechlImg, 'id', 'chechk')
        this.renderer.setStyle(chechlImg, 'display', 'none');

        const chechlImg2 = this.renderer.createElement('img');
        chechlImg2.src = '../../assets/icons/MedCent check.svg';
        this.renderer.setAttribute(chechlImg2, 'id', 'chechk')
        this.renderer.setStyle(chechlImg2, 'display', 'none');
        

        const xImg = this.renderer.createElement('img');
        xImg.src = '../../assets/icons/MedCent xmark.svg';
        this.renderer.setAttribute(xImg, 'id', 'xmark')
        this.renderer.setStyle(xImg, 'display', 'none');
        this.renderer.addClass(xImg, id_b_d)

        const inputField = this.renderer.createElement('textarea');
        this.renderer.setAttribute(inputField, 'maxlength', '250');
        this.renderer.setStyle(inputField, 'display', 'none');
        this.renderer.addClass(inputField, 'large-text-input');
        this.renderer.addClass(inputField, id_b_d)

        const reportDiv = this.renderer.createElement('div');
        this.renderer.addClass(reportDiv, 'report_div');
        this.renderer.setAttribute(reportDiv, 'id', id_b_d);
        this.renderer.setStyle(reportDiv, 'display', 'none');
        // render elemet
        
        
        // report element

        cal_data
        this.renderer.listen(cal_data, 'click', () => {
          this.servic.get_user_specific_reports(elemnt.patient_id).subscribe((data)=>{
              if(data['status'] === 200){
                this.user_specific_reports = data['data'].map((elem: ReportData)=>{
                  let l = new Date(elem.date_of_report)
                  let date1s = l.getFullYear()+"-"+l.getMonth()+"-"+l.getDay()+"/"+l.getHours()+":"+l.getMinutes()
                   l = new Date(elem.next_session)
                  let date2s = l.getFullYear()+"-"+l.getMonth()+"-"+l.getDay()+"/"+l.getHours()+":"+l.getMinutes()
                  elem.date1 = date1s
                  elem.date2 = date2s
                  return {
                    ...elem
                  }
                })
                this.cdr.detectChanges();
                this.el.nativeElement.querySelector(".report_data_container").style.visibility = "visible"
              }  
          })
        })
        this.renderer.listen(cancelImg, 'click', () => {

          if(!this.chechkStatusCancle(elemnt)){
              return
          } 
          inputField.setAttribute('placeholder', "Cancelation description...");
          inputField.style.display = 'block';
          cancelImg.style.display = 'none'
          noteImg.style.display = 'none'
          chechlImg.style.display = 'none';
          chechlImg2.style.display = 'block';
          xImg.style.display = 'block';
        })



        this.renderer.listen(noteImg, 'click', () => {
          if(!this.chechkStatusEdit(elemnt)){
            return
          }
          if(elemnt.doctorts_note == true){
            return;
          }
          
          const noteImgClass = noteImg.classList[0];

          this.createReport(this.el.nativeElement.querySelector(`#${noteImgClass}`))
          
          this.el.nativeElement.querySelector(`#${noteImgClass}`).style.display = 'block';
          cancelImg.style.display = 'none'
          noteImg.style.display = 'none'
          chechlImg.style.display = 'block';
          chechlImg2.style.display = 'none';
          xImg.style.display = 'block';


        })


        this.renderer.listen(xImg, 'click', () => {
      
          inputField.style.display = 'none';
          inputField.value = "";
          const noteImgClass = xImg.classList[0];
          this.el.nativeElement.querySelector(`#${id_b_d}`).style.display = 'none';
          this.destrory_parent(noteImgClass);
          cancelImg.style.display = 'block'
          noteImg . style.display = 'block'
          chechlImg.style.display = 'none';
          chechlImg2.style.display = 'none';
          xImg.style.display = 'none';
          //this.clear_report_data()
        })
        
        this.renderer.listen(chechlImg, 'click', () => {
        
            this.report_save(elemnt, id_b_d);
            inputField.style.display = 'none';
            inputField.value = "";
            this.el.nativeElement.querySelector(`#${id_b_d}`).style.display = 'none';
            this.destrory_parent(reportDiv);
            cancelImg.style.display = 'block'
            noteImg . style.display = 'block'
            chechlImg.style.display = 'none';
            xImg.style.display = 'none';
        })

          
        this.renderer.listen(chechlImg2, 'click', () => {
        
          const text = inputField.value;
          if(text.trim() === "" ){
            return
          }
          const data =  this.createCancelData(elemnt, text);
          console.log(data)
          this.servic.cancle_op_as_doc(data).subscribe((data)=>{
              if(data['status'] === 200){
                inputField.style.display = 'none';
                inputField.value = "";
                const noteImgClass = xImg.classList[0];
                this.el.nativeElement.querySelector(`#${id_b_d}`).style.display = 'none';
                this.destrory_parent(noteImgClass);
                cancelImg.style.display = 'block'
                noteImg . style.display = 'block'
                chechlImg.style.display = 'none';
                chechlImg2.style.display = 'none';
                xImg.style.display = 'none';
                const updatedCalanderData = this.calander_data.filter(data =>
                  !this.areCalanderDataEqual(data, elemnt)
                );
              }else{
                $('.popup-top').removeClass('success');
                $('.top-image img').attr(
                  'src',
                  '../../assets/icons/MedCent Exclamation.svg'
                );
                $('.top-message span').text("Sorry you can't submit...");
                $('.bottom-message span').text('Internal server error');
                $('.bottom-next span').text('Return to the form');
                $('.popup-background').addClass('popup-active');
                $("#breakDateend").addClass('input-box-empty');
                inputField.style.display = 'none';
                inputField.value = "";
                const noteImgClass = xImg.classList[0];
                this.el.nativeElement.querySelector(`#${id_b_d}`).style.display = 'none';
                this.destrory_parent(noteImgClass);
                cancelImg.style.display = 'block'
                noteImg . style.display = 'block'
                chechlImg.style.display = 'none';
                chechlImg2.style.display = 'none';
                xImg.style.display = 'none';
              }
          })
      })


        this.renderer.addClass(cancelImg, 'cancel-button');
        this.renderer.appendChild(wrapperDiv, wrapperDivInfo);
        this.renderer.appendChild(wrapperDivInfo, cal_data);
        this.renderer.appendChild(wrapperDivInfo, noteImg);
        this.renderer.appendChild(wrapperDivInfo, chechlImg);
        this.renderer.appendChild(wrapperDivInfo, chechlImg2);
        this.renderer.appendChild(wrapperDivInfo, cancelImg);
        this.renderer.appendChild(wrapperDivInfo, xImg);
        this.renderer.appendChild(wrapperDiv, inputField);
        this.renderer.appendChild(wrapperDiv, reportDiv);
        
        this.renderer.appendChild(viewChDiv, wrapperDiv);
      })
  }

  areCalanderDataEqual(data1: CalanderData, data2: CalanderData): boolean {
    return (
      data1.patient_id === data2.patient_id &&
      data1.servics === data2.servics &&
      data1.date_start.getTime() === data2.date_start.getTime() &&
      data1.date_end.getTime() === data2.date_end.getTime() &&
      data1.firstname === data2.firstname &&
      data1.lastname === data2.lastname &&
      data1.syntaxsugger === data2.syntaxsugger &&
      data1.doctorts_note === data2.doctorts_note &&
      data1.status === data2.status &&
      data1.cancled === data2.cancled
    );
  }

  createCancelData(elemnt, text){
    return {
      patient_id: elemnt.patient_id,
      date_of_start: new Date(elemnt.date_start),
      date_of_end: new Date(elemnt.date_end),
      doctor_id: this.doctor._id,
      text: text
    }

  }
  report_save(elemnt : CalanderData, id){
    const sessio_date = this.el.nativeElement.querySelector(`#${id} .session_date`).value;
    this.reportData.next_session = sessio_date;
    
    const reason_data = this.el.nativeElement.querySelector(`#${id} .reas_com_text`).value;
    this.reportData.reason_for_comming = reason_data;

    const diagno_text_date = this.el.nativeElement.querySelector(`#${id} .diagno_text`).value;
    this.reportData.diagnosis = diagno_text_date;


    const therapy_text_data = this.el.nativeElement.querySelector(`#${id} .therapy_text`).value;
    this.reportData.therapy = therapy_text_data;

    const date_cheker = new Date(sessio_date)
    const currentDate =  new Date()
    let flag = 0;
    let error_message = ""
    if(date_cheker < currentDate || sessio_date===""){
      error_message += "Date has to be in the future!\n";
      flag = 1;
    }
    if(reason_data.trim() === "" || diagno_text_date.trim() === "" || therapy_text_data.trim() === ""){
      error_message += "All textfilds must be fild!"
      flag = 1;
    }

    if(flag){
      $('.popup-top').removeClass('success');
      $('.top-image img').attr(
        'src',
        '../../assets/icons/MedCent Exclamation.svg'
      );
      $('.top-message span').text("Sorry you can't submit...");
      $('.bottom-message span').text(`${error_message}`);
      $('.bottom-next span').text('Return to the form');
      $('.popup-background').addClass('popup-active');
      $("#breakDateend").addClass('input-box-empty');
      return
    }
    
    this.reportData.patient_id = elemnt.patient_id;
    this.reportData.date_of_schedule = new Date(elemnt.date_start);
    this.reportData.doctor_id = this.doctor._id;
    console.log(this.reportData)
    this.servic.generate_report(this.reportData).subscribe((data)=>{
        if(data['status']===200){
          console.log("poslato")
          elemnt.doctorts_note = true
        }else{
          $('.popup-top').removeClass('success');
          $('.top-image img').attr(
            'src',
            '../../assets/icons/MedCent Exclamation.svg'
          );
          $('.top-message span').text("Sorry you can't submit...");
          $('.bottom-message span').text(`internal server error`);
          $('.bottom-next span').text('Return to the form');
          $('.popup-background').addClass('popup-active');
          $("#breakDateend").addClass('input-box-empty');
        }
    })


  }

  destrory_parent(noteImgClass){
    const targetDiv = this.el.nativeElement.querySelector(`#${noteImgClass}`)
    const clonedDiv = targetDiv.cloneNode(false)
    targetDiv.parentNode.insertBefore(clonedDiv, targetDiv);
    targetDiv.parentNode.removeChild(targetDiv);
  }

  clear_report_data(){
    this.reportData.date_of_report = null;
    this.reportData.doctors_name = "";
    this.reportData.next_session = null;
    this.reportData.specializzazione = "";
    this.reportData.reason_for_comming = "";
    this.reportData.diagnosis = "";
    this.reportData.therapy = "";
    this.reportData.patient_id = "";
    this.reportData.date_of_schedule = null;

  }

  createReport(parent){
    // date of creation report
    const date_div1 = this.renderer.createElement('div');
    this.renderer.addClass(date_div1, 'report_form')
    const date_current_span = this.renderer.createElement('span')
    let currentDate = new Date()
    date_current_span.innerHTML = "Date of report: "
    const date_current_input = this.renderer.createElement('span')
    const currentDateString = currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDay()+
    " "+currentDate.getHours()+":"+currentDate.getMinutes()  
    date_current_input.innerHTML = currentDateString
    this.renderer.appendChild(date_div1, date_current_span)
    this.renderer.appendChild(date_div1, date_current_input)

    // doctor name:
    const name_div = this.renderer.createElement('div');
    this.renderer.addClass(name_div, 'report_form')
    const doc_name = this.renderer.createElement('span')
    doc_name.innerHTML = `Docotor name: ${this.doctor.firstname} ${this.doctor. lastname}`
    this.renderer.appendChild(name_div, doc_name);

    // speciallization
    const doc_spec_div = this.renderer.createElement('div');
    this.renderer.addClass(doc_spec_div, 'report_form')
    const doc_spec = this.renderer.createElement('span')
    doc_spec.innerHTML = `Specializzazione: ${this.doctor.d_data["specializzazione"]}`
    this.renderer.appendChild(doc_spec_div, doc_spec);


    //reason for comming:
    const div_reason = this.renderer.createElement('div')
    this.renderer.addClass(div_reason, 'report_form')
    const reas_com = this.renderer.createElement('span')
    reas_com.innerHTML = "Reason for  comming:"
    this.renderer.appendChild(div_reason, reas_com);
    
    const reas_com_text = this.renderer.createElement('textarea')
    this.renderer.addClass(reas_com_text,'reas_com_text')
    this.renderer.appendChild(div_reason, reas_com_text);

    //diagnosis
    const diagno_div = this.renderer.createElement('div')
    this.renderer.addClass(diagno_div, 'report_form')
    const diagno_span = this.renderer.createElement('span')
    diagno_span.innerHTML = "Diagnosis: "
    this.renderer.appendChild(diagno_div, diagno_span);
    
    const diagno_text = this.renderer.createElement('input')
    this.renderer.setAttribute(diagno_text,'type','input')
    this.renderer.addClass(diagno_text,'diagno_text')
    this.renderer.appendChild(diagno_div, diagno_text);

    // therapy 
    const therapy_div = this.renderer.createElement('div')
    this.renderer.addClass(therapy_div, 'report_form')
    const therapy_span= this.renderer.createElement('span')
    therapy_span.innerHTML = "Threapy: "
    this.renderer.appendChild(therapy_div, therapy_span);
    
    const therapy_text = this.renderer.createElement('textarea')
    this.renderer.addClass(therapy_text,'therapy_text')
    this.renderer.appendChild(therapy_div, therapy_text);

    // nextsessio
    const session_div = this.renderer.createElement('div')
    this.renderer.addClass(session_div, 'report_form')
    const session_span= this.renderer.createElement('span')
    session_span.innerHTML = "Next Session:"
    this.renderer.appendChild(session_div, session_span);
    const session_input = this.renderer.createElement('input');
    this.renderer.setAttribute(session_input, 'type', 'date');
    this.renderer.addClass(session_input,'session_date')
    this.renderer.appendChild(session_div, session_input);
    // add to parent 
    this.renderer.appendChild(parent, date_div1)
    this.renderer.appendChild(parent, name_div)
    this.renderer.appendChild(parent, doc_spec_div)
    this.renderer.appendChild(parent, div_reason)
    this.renderer.appendChild(parent, diagno_div)
    this.renderer.appendChild(parent, therapy_div)
    this.renderer.appendChild(parent, session_div)
  }

  
  chechkStatusCancle(element){
    const group = ['finished', 'current'];
    if(group.includes(element.status)){
      return false
    }else{
      return true
    }
  }


  chechkStatusEdit(element){
    const group = ['ongoing'];
    if(!group.includes(element.status)){
      return false
    }else{
      return true
    }
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

  hide_rep_button(){
    this.el.nativeElement.querySelector(".report_data_container").style.visibility = "hidden"
  }
}
