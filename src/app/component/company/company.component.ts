import {Component, OnInit} from '@angular/core';
import {Company} from "../../model/company";
import {CompanyService} from "../../service/company.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})

export class CompanyComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
  });
  public company: Company = new Company();
  id: Number | undefined;
  public isEmpty: boolean = false;
  submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private companyService: CompanyService,
              private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    this.getCompany();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getCompany() {
    this.companyService.getCompanyByUserId(this.tokenStorageService.getUser().id).subscribe(
      (company) => {
        this.id = this.company.id;
        this.form = this.formBuilder.group(
          {
            name: [company.name, Validators.required],
            description: [company.description, Validators.required],
            email: [company.email, [Validators.required, Validators.email]],
            address: [company.address, Validators.required]
          })
        this.submitted = this.form.valid;
      },
      error => {
        console.warn(error)
      }
    )
  }

  postCompany() {
    this.companyService.postCompany(this.tokenStorageService.getUser().id, this.form.value).subscribe(
      () => {
        this.submitted = true;
      },
      error => console.warn(error)
    )
    window.location.reload();
  }
}
