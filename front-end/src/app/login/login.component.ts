import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {UserService} from "../services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message: string;

  constructor(private user: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  login(form: any) {
    if (form.valid) {
      this.message = null;
      this.user.login(form.controls.email.value, form.controls.password.value)
        .then(res => {
          if (res.why) this.message = res.why;
          else this.router.navigate(['/home', form.controls.email.value]);
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

}
