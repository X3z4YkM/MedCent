import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService{

  uri:string = 'http://localhost:4000';

  constructor(private http: HttpClient) { }
  login(username, password, role){
    const data = {
      username: username,
      password: password,
      role: role
    }

    return this.http.post(`${this.uri}/users/login`, data);

  }

  register(data){
    return this.http.post(`${this.uri}/users/register/patient`, data);
  }

  upload_img(img_src, file_extension){
    const data = {
      img_src: img_src,
      extension: file_extension
    }
    return this.http.post(`${this.uri}/users/img/save`, data);
  }

}
