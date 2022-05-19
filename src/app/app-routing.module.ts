import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InternshipComponent} from "./component/internship/internship.component";
import {CompanyComponent} from "./component/company/company.component";
import {RegisterComponent} from "./component/register/register.component";
import {LoginComponent} from "./component/login/login.component";
import {InternshipAdd} from "./component/internship-add/internship-add";
import {StudentComponent} from "./component/student/student.component";
import {CompanyForCheckComponent} from "./component/company-for-check/company-for-check.component";
import {ErrorPageComponent} from "./component/error-page/error-page.component";

const routes: Routes = [
  {path: '', component: InternshipComponent},
  {path: 'company', component: CompanyComponent},
  {path: 'internship', component: InternshipComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'internship-add', component: InternshipAdd},
  {path: 'student', component: StudentComponent},
  {path: 'company-for-check/:id', component: CompanyForCheckComponent},
  {path: 'error', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
