import { Component, OnInit } from '@angular/core';
import {CommentsService} from "../services/comments.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  comments: any;

  constructor(private commentService: CommentsService,
              private user: UserService) { }

  ngOnInit() {
  }

  save(form) {
    if (this.user.isLogged()) {
      this.commentService.save(UserService.getUserEmail(), form.controls.comment.value, UserService.getUserToken())
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
        })
    }
  }

}
