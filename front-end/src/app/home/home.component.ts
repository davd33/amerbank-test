import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  email: string;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    const id: Observable<string> = this.route.params.map(p => p['email']);
    id.subscribe((email) => {
      if (!email) this.router.navigate(['/login']);
      else {
        this.email = email;
      }
    });
  }

}
