import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthServiceService } from 'src/app/core/services/auth-service.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  modalRef?: BsModalRef;
  constructor(
    private auth: AuthServiceService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}
  logout() {
    this.auth.signOut().then(() => {
      this.modalRef?.hide();
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
