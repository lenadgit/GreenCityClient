import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestoreDto} from "../../../model/restroreDto";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute} from '@angular/router';
import {ChangePasswordService} from "../../../service/change-password.service";

@Component({
  selector: 'app-restore-form',
  templateUrl: './restore-form.component.html',
  styleUrls: ['./restore-form.component.css']
})
export class RestoreFormComponent implements OnInit, OnDestroy {
  private passwordErrorMessageBackEnd: string;
  private restoreDto: RestoreDto;
  private loadingAnim = false;
  private sub: any;

  constructor(private route: ActivatedRoute, private changePasswordService: ChangePasswordService) {
  }

  ngOnInit() {
    this.restoreDto = new RestoreDto();
    this.setNullAllMessage();
    this.sub = this.route.params.subscribe(params => {
      this.restoreDto.token = params['token'];
    });
  }

  sendPasswords() {
    this.changePasswordService.changePassword(this.restoreDto);
  }

  private setNullAllMessage() {
    this.passwordErrorMessageBackEnd = null;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
