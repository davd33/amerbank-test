import { Injectable } from '@angular/core';
import {Http} from "@angular/http";

import 'rxjs/add/operator/toPromise';

import {environment} from "../../environments/environment";

@Injectable()
export class CommentsService {

  private saveUrl = `${environment.FRONT_API_URL}/comment/save`;
  private listUrl = `${environment.FRONT_API_URL}/comment/list`;

  constructor(private http: Http) { }

  save(email: string, comment: string, token: string) {
    return this.http
      .post(
        this.saveUrl,
        {
          email: email,
          comment: comment,
          token: token
        }
      )
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(CommentsService.handleError);
  }

  list() {
    return this.http
      .get(this.listUrl)
      .toPromise()
      .then(res => {
        return res.json();
      })
      .catch(CommentsService.handleError);
  }

  private static handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
