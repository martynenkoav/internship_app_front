import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Student} from "../model/student";
import {map, Observable} from "rxjs";
import {TokenStorageService} from "./token-storage.service";
import {Const} from "../const/const";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class StudentService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  STUDENT_URL: string = environment.baseUrl + 'api/student';

  public getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(this.STUDENT_URL + "/" + id);
  }

  public postStudent(student: Student) {
    return this.http.post(this.STUDENT_URL, student);
  }

  public updateStudent(studentModel: Student) {
    return this.http.patch(this.STUDENT_URL + '/' + this.tokenStorageService.getUser().id, studentModel);
  }
}

