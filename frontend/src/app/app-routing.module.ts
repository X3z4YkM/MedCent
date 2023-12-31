import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { MenagerComponent } from './menager/menager.component';
import { GuestComponent } from './guest/guest.component';
import { UserProfileViewComponent } from './user-profile-view/user-profile-view.component';
import { DoctorProfileViewComponent } from './doctor-profile-view/doctor-profile-view.component';
import { RegisterDoctorComponent } from './register-doctor/register-doctor.component'
import { LoginManagerComponent } from './login-manager/login-manager.component'
const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'doctor', component: DoctorComponent},
  {path:'patient', component: PatientComponent},
  {path:'manager', component: LoginManagerComponent},
  {path:'manager/login', component: LoginManagerComponent},
  {path:'manager/profile', component: MenagerComponent},
  {path:'doctor_view', component: DoctorProfileViewComponent},
  {path:'', component: GuestComponent},
  {path:'patient_view', component: UserProfileViewComponent},
  {path:'register_doctor', component:RegisterDoctorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
