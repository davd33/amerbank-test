import {Component, OnInit} from '@angular/core';
import {CommentsService} from "../services/comments.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  comments: any;
  parentCommentsEmail: string;

  constructor(private commentService: CommentsService,
              private user: UserService) {
  }

  ngOnInit() {
    this.listComments();
  }

  d(str: string) {
    return decodeURIComponent(str);
  }

  listComments() {
    this.commentService.list(UserService.getUserToken())
      .then(res => {
        this.comments = res.data;
      })
      .catch(e => {
        console.log(e);
      })
  }

  approve(c_id: string) {
    this.commentService.approve(c_id, UserService.getUserToken())
      .then(res => {
        this.listComments();
      })
      .catch(e => {
        console.log(e);
      })
  }

  reply(commentForm, commentArea, commentId, commentAuthor) {
    commentForm.controls.parent.setValue(commentId);
    commentArea.focus();
    this.parentCommentsEmail = commentAuthor;
  }

  save(form) {
    if (this.user.isLogged()) {
      this.commentService.save(
        UserService.getUserEmail(),
        form.controls.comment.value,
        UserService.getUserToken(),
        form.controls.parent.value
      )
        .then(res => {
          this.listComments();
          form.reset();
          this.parentCommentsEmail = null;
        })
        .catch(e => {
          console.log(e);
        })
    }
  }

  isAdmin() {
    return UserService.getUserRole() === 'Admin';
  }

}
