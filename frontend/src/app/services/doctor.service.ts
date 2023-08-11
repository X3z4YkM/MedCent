import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  uri:string = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getDoctoFromToken(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/doctors/get_doctor`,data);
  }

  getSpecServicData(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/servics/specializzazione/get`,data);
  }

  save_data(data, img){
    const body = {
      new_user_data: data,
      img: img
    }
    return this.http.post(`${this.uri}/doctors/update_user`, body);
  }

  save_servic_data(data, token){
    const payload = {
      data:data,
      token: token
    }
    return this.http.post(`${this.uri}/servics/docotr/update`, payload);
  }

  add_workoff_dates(token, date1: Date, date2: Date){
    const data = {
      token: token,
      start_date: date1,
      end_date: date2
    }
    return this.http.post(`${this.uri}/servics/docotr/workoff/add`, data);
  }

  get_expiration_time(token){
    const data = {
      token: token
    }
   
    return this.http.post(`${this.uri}/users/chechk/session/expiration`, data);
  }

  set_new_req_spec(req, spec){
    const data = {
      request : req,
      specializzazione: spec
    }
    return this.http.post(`${this.uri}/servics/specializzazione/request/add`, data);
  }

  get_calender_for_doctor(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/doctors/calender/get`, data);
  }

  generate_report(report){
    const data = {
      data: report
    }
    return this.http.post(`${this.uri}/servics/report/generate`,data);
  }

  cancle_op_as_doc(data_send){
    const data = {
      data: data_send
    }
    return this.http.post(`${this.uri}/servics/appointment/cancle/doctor`,data);
  }

  get_user_specific_reports(id){
    const data = {
      id:id
    }
    return this.http.post(`${this.uri}/servics/reports/user/get`,data);
  }

} 
