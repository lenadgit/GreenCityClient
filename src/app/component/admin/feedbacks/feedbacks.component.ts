import {Component, OnInit} from '@angular/core';
import {CommentAdminDto} from '../../../model/comment/comment-admin-dto.model';
import {FeedbackService} from '../../../service/feedbacksAdmin/feedback.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {ConfirmationDialogService} from '../confirm-modal/confirmation-dialog-service.service';
import {NgFlashMessageService} from 'ng-flash-messages';
import {DialogPhotoComponent} from './dialog-photo/dialog-photo.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  displayedColumns: string[] = ['place', 'text', 'attachments', 'delete'];
  pageSize: number;
  page: number;
  totalItems: number;
  comments: CommentAdminDto[];
  dataSource = new MatTableDataSource<CommentAdminDto>();
  truncFlag = false;
  deleteTranslation: string;
  deleteMessageTranslation: string;

  constructor(private commentService: FeedbackService, private confirmationDialogService: ConfirmationDialogService,
              private ngFlashMessageService: NgFlashMessageService, private translation: TranslateService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.getCommentsByPage();

    this.translation.get('feedbacks.delete').subscribe(translation => this.deleteTranslation = translation);
    this.translation.get('feedbacks.Do-you-really-want-to-delete-comment-of').
    subscribe(translation => this.deleteMessageTranslation = translation);
  }

  changePage(event: any) {
    this.commentService.changePage(event.page - 1);
    this.commentService.pageSize = this.pageSize;
    this.getCommentsByPage();
  }

  getCommentsByPage() {
    this.commentService.getCommentsByPage().subscribe(res => {
      this.comments = res.page;
      this.page = this.commentService.page;
      this.totalItems = res.totalElements;
      this.dataSource.data = this.comments;
      this.pageSize = this.commentService.pageSize;
    });
  }

  confirmDelete(id: number, commentName: string) {
    this.confirmationDialogService.confirm(this.deleteTranslation, this.deleteMessageTranslation + ' ' + commentName + ' ?')
      .then((confirmed) => {
        if (confirmed) {
          this.delete(id);
        }
      });
  }

  delete(id: number) {
    this.commentService.delete(id).subscribe(
      () => {
        this.showMessage(`Comment was <b>DELETED</b>!`, 'success');
        this.getCommentsByPage();
      },
      error => {
        this.showMessage(`ERROR! Comment was not <b>DELETED</b>!. Please try again`, 'danger');
      }
    );
  }

  showMessage(message: string, messageType: string) {
    this.ngFlashMessageService.showFlashMessage({
      messages: [message],
      dismissible: true,
      timeout: 3000,
      type: messageType,
    });
  }

  changeVisability(id: string, id2: string) {
    document.getElementById(id).hidden = !document.getElementById(id).hidden;
    document.getElementById(id2).hidden = !document.getElementById(id2).hidden;
  }

  openDialog(photoUrl: string): void {
    const dialogRef = this.dialog.open(DialogPhotoComponent, {
      width: '55%',
      height: '65%',
      hasBackdrop: true,
      data: photoUrl
    });
  }
}
