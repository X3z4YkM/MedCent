import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenagerService {

  uri:string = 'http://localhost:4000';
  constructor(private http: HttpClient) { }
  
  get_all_user_data(){
    return this.http.get(`${this.uri}/manager/get_all_users`);
  }

  get_all_requests_data(){
    return this.http.get(`${this.uri}/manager/get_all_requests`);
  }


  updateUser(data, img){
    const body = {
      new_user_data: data,
      img: img
    }
    return this.http.post(`${this.uri}/manager/update_user`, body);
  }

  update_status(user, status){
    const data = {
      username: user.username,
      status: status
    }
    return this.http.post(`${this.uri}/users/update_status`,data);
  }


  get_all_new_service(){
    return this.http.get(`${this.uri}/servics/request/get`);
  }


  remove_requested_service(spec, req){
    const data = {
      specializzazione: spec,
      data: req
    }
    return this.http.post(`${this.uri}/manager/request/service/remove`,data);
  }

  aprove_requested_service(spec, req){
    const data = {
      specializzazione: spec,
      data: req
    }
    return this.http.post(`${this.uri}/manager/request/service/aprove`,data);
  }

  get_all_spec_serv(){
    return this.http.get(`${this.uri}/manager/specializzazione/services/get/all`)
  }

  gupdate_specser(paiload){
    const data = {
      data: paiload
    }
    return this.http.post(`${this.uri}/manager/specializzazione/services/update`, data)
  }

  delete_servic(paiload, specializzazione){
    const data = {
      id: paiload.id,
      spec: specializzazione
    }
    return this.http.post(`${this.uri}/manager/specializzazione/services/delete`, data)
  }

  add_spec(name){
    const data = {
      name: name
    }
    return this.http.post(`${this.uri}/manager/specializzazione/add`, data)
  }


  get_all_spec(){
    return this.http.get(`${this.uri}/manager/specializzazione/get/all`);
  }


  add_ser_spec(spec, req){
    const data = {
      specializzazione: spec,
      data: req
    }
    return this.http.post(`${this.uri}/manager/specializzazione/service/add`,data);
  }

  get_all_services(){
    return this.http.get(`${this.uri}/manager/services/get/all`);
  }

  add_discount(id, off){
    const data ={
      sid: id,
      off: off
    }
     return this.http.post(`${this.uri}/servics/discount/add`,data);
  }


  getManagerFromToken(token){
    const data = {
      token: token
    }
    return this.http.post(`${this.uri}/manager/get_manager`,data);

  }

}
