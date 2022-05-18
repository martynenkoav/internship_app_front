import {Component, OnInit} from '@angular/core';
import {StudentService} from "../../service/student.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {Student} from "../../model/student";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  public student: Student;

  constructor(private studentService: StudentService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.getStudent();
  }

  getStudent() {
    this.studentService.getStudentById(this.tokenStorageService.getUser().id).subscribe(
      (student) => {
        this.student = student;
      },
      error => console.warn(error)
    )
  }

  postStudent() {
    this.studentService.postStudent(this.student).subscribe(
      () => console.log('Posting correctly'),
      error => console.warn(error)
    )
    window.location.reload();
  }
}
