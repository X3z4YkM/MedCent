import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { MenagerComponent } from './menager/menager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule,} from  '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GuestComponent } from './guest/guest.component';
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { DoctorProfileViewComponent } from './doctor-profile-view/doctor-profile-view.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component';
import { LoginManagerComponent } from './login-manager/login-manager.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    DoctorComponent,
    PatientComponent,
    MenagerComponent,
    GuestComponent,
    UserProfileViewComponent,
    DoctorProfileViewComponent,
    RegisterDoctorComponent,
    LoginManagerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
