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
}
