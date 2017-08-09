import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {UserService} from "../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;
  role: string;

  roles = [{name: 'User', default: true}, {name: 'Admin'}];

  constructor(private user: UserService,
              private router: Router) { }

  ngOnInit() {
  }

  register(form: any) {
    if (form.valid) {
      this.user.register(form.controls.email.value, form.controls.password.value, form.controls.role.value.name)
        .then(res => {
          this.router.navigate(['/']);
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

}
