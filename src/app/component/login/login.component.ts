import {Component, OnInit} from '@angular/core';
import {User} from "../../model/user";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {TokenStorageService} from "../../service/token-storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private router: Router, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit(): void {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
    }
    this.user = {
      username: "",
      password: ""
    }
  }

  onSubmit(): void {
    this.authService.login(this.user)
      .subscribe(
        data => {
          this.tokenStorageService.saveToken(data.accessToken);
          this.tokenStorageService.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorageService.getUser().roles;
          if (this.roles.includes('ROLE_COMPANY')) {
            this.router.navigate(["/company"]).then(() => {
              this.reloadPage()
            })
          } else {
            this.router.navigate(["/student"]).then(() => {
              this.reloadPage()
            })
          }
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        });
  }

  public cleanButtonClicked() {
    this.user = new User();
  }

  reloadPage(): void {
    window.location.reload();
  }
}
