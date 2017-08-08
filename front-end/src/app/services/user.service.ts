import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

import {environment} from '../../environments/environment';
import {Http} from "@angular/http";

@Injectable()
export class UserService {

  private registerUrl = `${environment.FRONT_API_URL}/user/register`;
  private loginUrl = `${environment.FRONT_API_URL}/user/login`;

  constructor(private http: Http) {
  }

  isLogged(email: string) {
    let userEmail = localStorage.getItem('userEmail');
    return userEmail && decodeURIComponent(userEmail) === email;
  }

  logout() {
    localStorage.removeItem('userEmail');
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
        let userLogin = res.json();
        localStorage.setItem('userEmail', userLogin.account.email);
        return userLogin;
      })
      .catch(UserService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
