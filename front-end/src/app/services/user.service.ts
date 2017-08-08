import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {environment} from '../../environments/environment';
import {Http} from "@angular/http";

@Injectable()
export class UserService {

  private registerUrl = `${environment.FRONT_API_URL}/user/register`;
  private loginUrl = `${environment.FRONT_API_URL}/user/login`;

  private userLogin: any;

  constructor(private http: Http) {
  }

  register(email: string, password: string) {
    return this.http
      .post(
        this.registerUrl,
        {
          email: email,
          password: password
        }
      )
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(UserService.handleError);
  }

  login(email: string, password: string) {
    return this.http
      .post(
        this.loginUrl,
        {
          email: email,
          password: password
        }
      )
      .toPromise()
      .then(res => {
        this.userLogin = res.json();
        return this.userLogin;
      })
      .catch(UserService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
