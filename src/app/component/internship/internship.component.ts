import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Internship} from "../../model/internship";
import {InternshipService} from "../../service/internship.service";
import {Company} from "../../model/company";
import {CompanyService} from "../../service/company.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {Router} from "@angular/router";
import {StudentService} from "../../service/student.service";
import 'bootstrap';
import {catchError, forkJoin, isEmpty, never, throwError} from "rxjs";
import {FormControl} from "@angular/forms";

export interface Tag {
  value: string;
  viewValue: string;
}

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
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.css']
})

export class InternshipComponent implements OnInit {




  viewInternships: Internship[] = [];
  tags: Tag[] = [
    {value: 'ALL', viewValue: 'Все'},
    {value: 'AUTOMOTIVE_BUSINESS', viewValue: 'Автомобильный бизнес'},
    {value: 'ADMINISTRATIVE_STAFF', viewValue: 'Административный персонал'},
    {value: 'SAFETY', viewValue: 'Безопасность'},
    {value: 'TOP_MANAGEMENT', viewValue: 'Высший менеджмент'},
    {value: 'PURCHASES', viewValue: 'Закупки'},
    {value: 'INFORMATION_TECHNOLOGY', viewValue: 'Информационные технологии'},
    {value: 'ART', viewValue: 'Искусство'},
    {value: 'ADVERTISING', viewValue: 'Реклама'},
    {value: 'MEDICINE', viewValue: 'Медицина'},
    {value: 'SALES', viewValue: 'Продажи'},
    {value: 'TOURISM', viewValue: 'Туризм'},
    {value: 'PERSONNEL_MANAGEMENT', viewValue: 'Управление персоналом'},
    {value: 'LAWYERS', viewValue: 'Юристы'},
    {value: 'OTHER', viewValue: 'Другое'}
  ];
  internships: Internship[];
  myInternships: Internship[] = [];
  company: Company;
  companies: Company[] = [];
  roles: string[] = [];
  hasAccess: boolean = false;
  isStudent: boolean;
  currentUser: any;
  currentStudent: any;
  studentTags: any[] = [];
  filters: Map<string, string | string[]> = new Map<string, string | string[]>();
  tagsForSearch: FormControl = new FormControl('');
  currentButton: string = "all";

  constructor(private internshipService: InternshipService, private companyService: CompanyService,
              private studentService: StudentService, private tokenStorageService: TokenStorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.filters.set("name", "");
    this.filters.set("tag", "");
    this.getAccess();
    this.currentButton = "all";

    if (this.roles?.includes("ROLE_STUDENT")) {
      forkJoin(
        this.currentStudent = this.studentService.getStudentById(this.tokenStorageService.getUser().id),
        this.internshipService.getInternships(),
        this.internshipService.getInternshipsByStudentId(this.tokenStorageService.getUser().id),
        this.companyService.getCompanies()
      ).subscribe(([student, internships, myInternships, companies]) => {
        this.currentStudent = student;
        this.internships = internships;
        this.companies = companies;
        this.internships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
        this.internships.forEach(internship => {
          internship.company = this.companies.find(company => company.id === internship.company_id);
        });
        this.myInternships = myInternships;
        this.myInternships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
        this.myInternships.forEach(internship => {
          internship.company = this.companies.find(company => company.id === internship.company_id);
        });
        this.viewInternships = internships;

        for (let i = 0; i < 50; i++) {
          this.viewInternships = [...internships, ...this.viewInternships];
          console.log(internships);
        }
      })
    } else {
      forkJoin(
        this.internshipService.getInternships(),
        this.companyService.getCompanies(),
      ).subscribe(([internships, companies]) => {
        this.internships = internships;
        this.companies = companies;
        this.internships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
        this.internships.forEach(internship => {
          internship.company = this.companies.find(company => company.id === internship.company_id);
        });
        this.viewInternships = internships;
        for (let i = 0; i < 50; i++) {
          this.viewInternships = [...internships, ...this.viewInternships];
          console.log(internships);
        }
      })
    }
  }

  getAccess() {
    this.roles = this.tokenStorageService.getUser().roles;
    if (this.roles?.includes("ROLE_STUDENT") || this.roles?.includes("ROLE_COMPANY")) {
      this.hasAccess = true;
    }
    if (this.roles?.includes("ROLE_STUDENT")) {
      this.isStudent = true;
    }
    this.currentUser = this.tokenStorageService.getUser();
  }


  filterSearch(event: any) {
    this.filters.set('name', event.target.value.toLowerCase());
    this.doFilter();
  }

  filterTags(tags: FormControl) {
    if (tags.value.includes('Все') && !this.filters.get('tags')?.includes('Все')) {
      tags.setValue(['Все']);
      this.viewInternships = this.internships;
    } else {
      const tagsCur = tags.value.filter(tag => tag !== "Все");
      tags.setValue(tagsCur);
    }
    this.filters.set('tags', tags.value);
    if (this.filters.get('tags')?.includes('Все')) {
      this.viewInternships = this.internships;
    } else {
      this.doFilter();
    }
  }

  doFilter() {
    this.viewInternships = this.internships;
    this.filters.forEach((value, key) => {
      if (typeof (value) === "string") {
        if (value !== "") {
          this.viewInternships = this.viewInternships.filter(x =>
            x[key].toLowerCase().includes(value));
        }
      } else {
        this.viewInternships = this.viewInternships.filter(x => x.tags.filter(tag => value.includes(tag)).length !== 0)
      }
    })
  }

  goToCompany(id: number) {
    this.router.navigate(['/company-for-check/', id]);
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

  showStudentsInternships() {
    this.currentButton = "student";
    this.viewInternships = this.myInternships;
  }

  isInStudentsList(id: number):
    boolean {
    if (this.currentStudent == null) {
      return false;
    } else {
      return this.currentStudent.internships.includes(id);
    }
  }

  getRecommendationInternships() {
    this.currentButton = "advice";

    let allInternships = this.internships;

    let studentInternships = this.myInternships;

    studentInternships.forEach(internship => internship.tags.forEach(tag => this.studentTags.push(tag)));

    let studentInternshipsIds = studentInternships.map(studentInternship => studentInternship.id);

    let result = allInternships.filter(internship => !studentInternshipsIds.includes(internship.id));

    this.viewInternships = result.filter(x => x.tags.filter(tag => this.studentTags.includes(tag)).length !== 0);
  }
}

