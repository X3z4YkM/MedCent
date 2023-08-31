import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


export class PatientService {
  uri:string = 'http://localhost:4000';
  constructor(private http: HttpClient) { }
  
  get_img(token){
   
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/users/img/get`, data);
  }

  get_expiration_time(token){
    const data = {
      token: token
    }
   
    return this.http.post(`${this.uri}/users/chechk/session/expiration`, data);
  }

  getPatientFromToken(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/patients/get_patient`,data);
  }
  save_data(data, img){
    const body = {
      new_user_data: data,
      img: img
    }
    return this.http.post(`${this.uri}/patients/update_user`, body);
  }


  getUserById(id){
    const data = {
      id: id
    }
    return this.http.post(`${this.uri}/patients/user/get/id`,data);
  }

  add_reservations(doctorId, user_data, service_name,ds:Date, de:Date){
    const data = {
      doctor_id: doctorId,
      udata: user_data,
      servic_name: service_name,
      date_start: ds,
      date_end: de
    }
    console.log(data)
    return this.http.post(`${this.uri}/servics/user/set/reservation`,data);
  }

  cancle_appoinment(did,pid,ds,de,obj){
    const paiload = {
      doctor_id: did,
      patient_id: pid,
      date_of_start: ds,
      date_of_end: de,
      cal_data :obj
    }
    const data = {
      data: paiload
    }
    return this.http.post(`${this.uri}/servics/appointment/cancle/patient`,data);
  }

  get_my_reports(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/servics/user/get/reports`, data)
  }
  get_my_apointments(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/servics/user/get/apoinments`, data)
  }
  download_one(report, patient){
    const data = {
      id: report._id,
      data: report,
      me: patient
    }
    return this.http.post(`${this.uri}/servics/patient/download/pdf/make`, data)
  }
  
  download_all(report, patient){
    const data = {
      id: report._id,
      data: report,
      me: patient
    }
    return this.http.post(`${this.uri}/servics/patient/download/pdf/all/make`, data)
  }

  get_noti(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/servics/patient/get/notifi`, data)

  }


}
