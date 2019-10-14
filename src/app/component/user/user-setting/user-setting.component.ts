import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../service/user/user.service';
import {UserUpdateModel} from '../../../model/user/user-update.model';
import {JwtService} from '../../../service/jwt.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {

  private email = '';
  private userUpdateModel = new UserUpdateModel();
  // private newUserUpdateModel = new UserUpdateModel();
  private isFirstNameEditing = false;
  private isLastNameEditing = false;
  private isSomethingEdited = false;
  private emailNotifications: string[] = [];

  constructor(private userService: UserService, private jwtService: JwtService, private dialogRef: MatDialogRef<UserSettingComponent>) {
    this.email = jwtService.getEmailFromAccessToken();
    this.getUser();
    this.setEmailNotifications();
  }

  ngOnInit() {
  }

  private getUser() {
    this.userService.getUser().subscribe((userUpdateModel: UserUpdateModel) => {
      this.userUpdateModel = userUpdateModel;
    });
  }

  private updateUser() {
    this.userService.updateUser(this.userUpdateModel).subscribe(
      () => {
        this.jwtService.setFirstName(this.userUpdateModel.firstName);
        this.dialogRef.close();
        window.location.href = '/';
      },
      error => {

      });
  }

  private somethingEdited() {
    console.log('something edited');
    this.isLastNameEditing = false;
    this.isFirstNameEditing = false;
    this.isSomethingEdited = true;
  }

  private firstNameEditing() {
    if (!this.isLastNameEditing) {
      this.isFirstNameEditing = true;
    }
  }

  private lastNameEditing() {
    if (!this.isFirstNameEditing) {
      this.isLastNameEditing = true;
    }
  }

  private setEmailNotifications() {
    this.userService.getEmailNotificationsStatuses().subscribe(res => {
      this.emailNotifications = [...res.filter((eNotification) => {
        return eNotification !== 'DISABLED';
      }).map((column) => column)];
    });
  }
}
