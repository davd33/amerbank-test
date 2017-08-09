import {Injectable} from '@angular/core';
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';

import {environment} from '../../environments/environment';

@Injectable()
export class UserService {

  private registerUrl = `${environment.FRONT_API_URL}/user/register`;
  private loginUrl = `${environment.FRONT_API_URL}/user/login`;

  constructor(private http: Http) {
  }

  isLoggedEmail(email: string) {
    let userEmail = UserService.getUserEmail();
    return userEmail && userEmail === email;
  }

  isLogged() {
    return UserService.getUserEmail();
  }

  logout() {
    UserService.clearUser()
  }

  register(email: string, password: string, role: string) {
    return this.http
      .post(
        this.registerUrl,
        {
          email: email,
          password: password,
          role: role
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
        UserService.storeUser(userLogin)
        return userLogin;
      })
      .catch(UserService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private static storeUser(userLogin) {
    localStorage.setItem('user_email', userLogin.account.email);
    localStorage.setItem('user_token', userLogin.account.token);
    localStorage.setItem('user_role', userLogin.role);
    localStorage.setItem('user_id', userLogin.account.user);
  }

  public static getUserEmail(): string {
    return decodeURIComponent(localStorage.getItem('user_email'));
  }

  public static getUserToken(): string {
    return localStorage.getItem('user_token');
  }

  public static getUserRole(): string {
    return localStorage.getItem('user_role');
  }

  public static getUserId(): string {
    return localStorage.getItem('user_id');
  }

  private static clearUser() {
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
  }

}
