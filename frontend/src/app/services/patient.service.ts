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

}
