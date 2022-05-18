import {Component, OnInit} from '@angular/core';
import {Internship} from "../../model/internship";
import {InternshipService} from "../../service/internship.service";
import {Company} from "../../model/company";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TokenStorageService} from "../../service/token-storage.service";
import {CompanyService} from "../../service/company.service";
import {Tag} from "../internship/internship.component";

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
  selector: 'app-internships-by-comp-id',
  templateUrl: './internship-add.html',
  styleUrls: ['./internship-add.css']
})

export class InternshipAdd implements OnInit {

  tagsAll: Tag[] = [
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
  internshipsWithoutFilt: Internship[];
  company: Company;

  internshipForm: FormGroup = this.formBuilder.group({
    name: [''],
    description: [''],
    url: [''],
  })
  tags: FormControl = new FormControl('');
  currentUser: any;

  constructor(private internshipService: InternshipService, private companyService: CompanyService,
              private formBuilder: FormBuilder, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {

    this.getCompany();
    this.loadInternships();
  }

  getCompany() {
    this.companyService.getCompanyByUserId(this.tokenStorageService.getUser().id).subscribe(
      (company) => {
        this.company = company;
      },
      error => console.warn(error)
    )
  }

  loadInternships() {

    this.internshipService.getInternshipsByUserId(this.tokenStorageService.getUser().id).subscribe(
      (internships) => {
        this.internships = internships;
        this.internships.forEach(internship => {
          internship.tags = internship.tags.map(tag => TAGS[tag]);
        });
        this.internshipsWithoutFilt = internships;
      },
      error => console.warn(error)
    )
  }

  deleteInternship(id: number) {
    this.internshipService.deleteInternship(id).subscribe(
      value => {
        window.location.reload();
      },
      error => {
        console.warn(error);
      }
    )
  }

  postInternship() {
    let newInternship = this.extractFormData();
    this.internshipService.postInternship(this.tokenStorageService.getUser().id, newInternship).subscribe(
      value => {
        window.location.reload();
      },
      error => console.warn(error)
    )
  }

  filterList(event: any) {
    this.internships = this.internshipsWithoutFilt.filter(x => x.name.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  extractFormData(): Internship {
    let internshipData = this.internshipForm.value;

    let newInternship = new Internship();
    newInternship.name = internshipData.name;
    newInternship.description = internshipData.description;
    newInternship.company_id = this.company.id;
    newInternship.url = internshipData.url;
    newInternship.responses = 0;
    newInternship.tags = this.tags.value;

    return newInternship;
  }
}
