import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

import {UserService} from "../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  email: string;
  userRole: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private user: UserService) { }

  ngOnInit() {
    const id: Observable<string> = this.route.params.map(p => p['email']);
    id.subscribe((email) => {
      if (!email) this.router.navigate(['/login']);
      else {
        if (this.user.isLogged(email)) {
          this.email = email;
          this.userRole = UserService.getUserNick();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  logout() {
    this.user.logout();
    this.router.navigate(['/login']);
  }

}
