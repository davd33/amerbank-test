import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  role: string;
  errMessage: string;

  roles = [{name: 'User', default: true}, {name: 'Admin'}];

  constructor(private user: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  register(form: any) {
    if (form.valid) {
      this.errMessage = null;

      this.user.register(form.controls.email.value, form.controls.password.value, form.controls.role.value.name)
        .then(res => {
          if (res.why) this.errMessage = res.why;
          else this.router.navigate(['/']);
        })
        .catch(e => {
          console.log(e)
        })
    } else {
      console.log(form);
    }
  }

}
