import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from "../model/user";
import {FormControl, FormGroup} from "@angular/forms";
import {Const} from "../const/const";
import {environment} from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  AUTH_URL: string = environment.baseUrl + 'api/auth';

  login(user: User): Observable<any> {
    return this.http.post(this.AUTH_URL + '/signin', user, httpOptions);
  }

  register(user: FormGroup): Observable<any> {
    return this.http.post(this.AUTH_URL, user, httpOptions);
  }
}
