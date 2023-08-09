import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  uri:string = 'http://localhost:4000';
  constructor(private http: HttpClient) { }

  getAllDoctors(){
    return this.http.get(`${this.uri}/doctors/get_all`);
  }

  chechk_token(token){
    const data = {
      token : token
    }
    return this.http.post(`${this.uri}/users/token_data`,data);
  }
}
