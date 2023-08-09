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
}
