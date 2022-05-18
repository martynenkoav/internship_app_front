import {Component, OnInit} from '@angular/core';
import {Company} from "../../model/company";
import {CompanyService} from "../../service/company.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenStorageService} from "../../service/token-storage.service";
import {Internship} from "../../model/internship";
import {InternshipService} from "../../service/internship.service";
import {forkJoin} from "rxjs";
import {StudentService} from "../../service/student.service";

enum TAGS {
  ALL = "Все",
  AUTOMOTIVE_BUSINESS = "Автомобильный бизнес",
  ADMINISTRATIVE_STAFF = "Административный персонал",
  SAFETY = "Безопасность",
  TOP_MANAGEMENT = "Высший менеджмент",
  PURCHASES = "Закупки",
  INFORMATION_TECHNOLOGY = "Информационные технологии",
  ART = "Искусство",
  ADVERTISING = "Реклама",
  MEDICINE = "Медицина",
  SALES = "Продажи",
  TOURISM = "Туризм",
  PERSONNEL_MANAGEMENT = "Управление персоналом",
  LAWYERS = "Юристы",
  OTHER = "Другое"
}

@Component({
  selector: 'app-company-for-check',
  templateUrl: './company-for-check.component.html',
  styleUrls: ['./company-for-check.component.css']
})

export class CompanyForCheckComponent implements OnInit {

  viewInternships: Internship[];
  internships: Internship[];
  public company: Company;
  companyId: number;
  isStudent: boolean;
  roles: string[] = [];
  currentStudent: any;

  constructor(private companyService: CompanyService, private tokenStorageService: TokenStorageService,
              private activatedRoute: ActivatedRoute, private internshipService: InternshipService,
              private studentService: StudentService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params['id'];
    });

    this.getAccess();

    if (this.roles?.includes("ROLE_STUDENT")) {
      forkJoin(
        this.currentStudent = this.studentService.getStudentById(this.tokenStorageService.getUser().id),
        this.companyService.getCompanyById(this.companyId),
        this.internshipService.getInternshipsByCompanyId(this.companyId)
      ).subscribe(([student, company, internships]) => {
        this.currentStudent = student;
        this.company = company;
        this.viewInternships = internships;
        this.internships = internships;
        this.viewInternships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
      })
    } else {
      forkJoin(
        this.companyService.getCompanyById(this.companyId),
        this.internshipService.getInternshipsByCompanyId(this.companyId)
      ).subscribe(([company, internships]) => {
        this.company = company;
        this.viewInternships = internships;
        this.internships = internships;
        this.viewInternships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
      })
    }
  }

  filterList(event: any) {
    this.viewInternships = this.internships.filter(x => x.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  getAccess() {
    this.roles = this.tokenStorageService.getUser().roles;
    if (this.roles?.includes("ROLE_STUDENT")) {
      this.isStudent = true;
    }
  }

  goToTheLink(internship: Internship) {
    internship.responses++;
    this.internshipService.patchInternship(this.tokenStorageService.getUser().id, internship).subscribe(
      error => console.warn(error)
    )
    open(internship.url);
  }

  addInternshipToStudent(id: number) {
    this.currentStudent.internships.push(id);
    this.studentService.updateStudent(this.currentStudent).subscribe(
      () => {
        window.location.reload();
      },
      error => console.warn(error)
    );
  }

  isInStudentsList(id: number):
    boolean {
    if (this.currentStudent == null) {
      return false;
    } else {
      return this.currentStudent.internships.includes(id);
    }
  }
}
