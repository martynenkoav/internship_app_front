import {Injectable} from '@angular/core';
import {Company} from "../model/company";
import {HttpClient} from "@angular/common/http";
import 'rxjs';
import {Observable} from 'rxjs';
import {Const} from "../const/const";
import {FormGroup} from "@angular/forms";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  constructor(private http: HttpClient) {
  }

  private COMPANY_URL: string = environment.baseUrl + 'api/company';

  public getCompanies(): Observable<any> {
    return this.http.get<any>(this.COMPANY_URL);
  }

  public getCompanyByUserId(id: number): Observable<any> {
    return this.http.get<any>(this.COMPANY_URL + "/" + id);
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(this.COMPANY_URL + "/company/" + id);
  }

  public postCompany(id: number, company: FormGroup) {
    return this.http.post(this.COMPANY_URL + '/' + id, company);
  }
}
